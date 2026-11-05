import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { serverUrl } from "../App";
import { Rocket, Code2, Monitor, Send, X, MessageSquare } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Editor from "@monaco-editor/react";

const WebsiteEditor = () => {
  const { id } = useParams();
  const [website, setWebsite] = useState(null);
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const iframeRef = useRef(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [thinkingIndex, setThinkingIndex] = useState(0);
  const [showCode, setShowCode] = useState(false);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const thinkingSteps = [
    "Understanding your request...",
    "Planning the layout...",
    "Optimizing responsiveness...",
    "Adding smooth animations...",
    "Finalizing your website...",
  ];

  const handleUpdate = async () => {
    if (!prompt) return;
    setUpdateLoading(true);
    const text = prompt;
    setPrompt("");
    setMessages((m) => [...m, { role: "user", content: prompt }]);
    try {
      const result = await axios.post(
        `${serverUrl}/api/website/update/${id}`,
        { prompt: text },
        { withCredentials: true },
      );
      console.log(result);
      setUpdateLoading(false);
      setMessages((m) => [...m, { role: "ai", content: result.data.message }]);
      setCode(result.data.code);
    } catch (error) {
      setUpdateLoading(false);
      console.log(error.response?.data);
    }
  };

  const handleDeploy = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/website/deploy/${website._id}`, {withCredentials:true})
        window.open(`${result.data.url}`, "_blank")
        
      } catch (error) {
        console.log(error)
      }
    }

  useEffect(() => {
    if (!updateLoading) return;
    const i = setInterval(() => {
      setThinkingIndex((i) => (i + 1) % thinkingSteps.length);
    }, 1200);

    return () => clearInterval(i);
  }, [updateLoading]);

  useEffect(() => {
    const handleGetWebsite = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/website/get-by-id/${id}`,
          { withCredentials: true },
        );
        setWebsite(result.data);
        setCode(result.data.latestCode);
        setMessages(result.data.conversation);
      } catch (error) {
        console.log(error);
        setError(error.response.data.message);
      }
    };
    handleGetWebsite();
  }, [id]);

  useEffect(() => {
    if (!iframeRef.current || !code) return;

    const blob = new Blob([code], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    iframeRef.current.src = url;

    return () => URL.revokeObjectURL(url);
  }, [code]);

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#020617] text-red-400 text-lg">
        {error}
      </div>
    );
  }

  if (!website) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#020617] text-zinc-300 text-lg animate-pulse">
        Generating your website...
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex bg-[#020617] text-white overflow-hidden">
      <aside className="hidden lg:flex w-[380px] flex-col border-r border-white/10 bg-[#020617]/80 backdrop-blur-xl">
        <Header />
        <>
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] ${
                  m.role === "user" ? "ml-auto" : "mr-auto"
                }`}
              >
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-indigo-500 text-white"
                      : "bg-white/5 border border-white/10 text-zinc-300"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {updateLoading && (
              <div className="max-w-[85%] mr-auto">
                <div className="px-4 py-2.5 rounded-2xl text-xs bg-white/5 border border-white/10 text-zinc-400 italic animate-pulse">
                  {thinkingSteps[thinkingIndex]}
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-white/10">
            <div className="flex gap-2">
              <input
                placeholder="Reply to WebGen.ai"
                className="flex-1 resize-none rounded-2xl px-4 py-3 bg-white/5 border border-white/10 text-sm text-white placeholder-zinc-500 outline-none focus:ring-2 focus:ring-indigo-400/40"
                onChange={(e) => setPrompt(e.target.value)}
                value={prompt}
              />
              <button
                className="px-4 py-3 rounded-2xl bg-indigo-500 text-white hover:bg-indigo-600 transition"
                disabled={updateLoading}
                onClick={handleUpdate}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </>
      </aside>

      <div className="flex-1 flex flex-col">
        <div className="flex h-14 px-4 justify-between items-center border-b border-white/10 bg-[#020617]/80 backdrop-blur-xl">
          <span className="text-xs text-zinc-400">Live Preview</span>

          <div className="flex gap-2">
            {website.deployed ? "" : <button className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-linear-to-r from-indigo-500 to-purple-500 text-white text-sm font-semibold hover:from-indigo-600 hover:to-purple-600 transition"
            onClick={handleDeploy}
            >
              <Rocket size={14} />
              Deploy
            </button>}
            

            <button className="p-2 lg:hidden" onClick={() => setShowChat(true)}>
              <MessageSquare size={18} />
            </button>

            <button
              className="p-2 rounded-lg hover:bg-white/10 transition"
              onClick={() => setShowCode(true)}
            >
              <Code2 size={18} />
            </button>
            <button
              className="p-2 rounded-lg hover:bg-white/10 transition"
              onClick={() => setShowFullPreview(true)}
            >
              <Monitor size={18} />
            </button>
          </div>
        </div>
        <iframe ref={iframeRef} sandbox='allow-scripts alloe-same-origin allow-forms' className="flex-1 w-full bg-white" />
      </div>

      <AnimatePresence>
        {showChat && (
  <motion.div
    initial={{ y: "100%" }}
    animate={{ y: 0 }}
    exit={{ y: "100%" }}
    transition={{ duration: 0.35, ease: "easeInOut" }}
    className="fixed inset-0 z-[9999] bg-[#020617] flex flex-col overflow-hidden"
  >
            <Header onclose={() => setShowChat(false)}/>
            <>
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`max-w-[85%] ${
                      m.role === "user" ? "ml-auto" : "mr-auto"
                    }`}
                  >
                    <div
                      className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        m.role === "user"
                          ? "bg-indigo-500 text-white"
                          : "bg-white/5 border border-white/10 text-zinc-300"
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}

                {updateLoading && (
                  <div className="max-w-[85%] mr-auto">
                    <div className="px-4 py-2.5 rounded-2xl text-xs bg-white/5 border border-white/10 text-zinc-400 italic animate-pulse">
                      {thinkingSteps[thinkingIndex]}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-3 border-t border-white/10">
                <div className="flex gap-2">
                  <input
                    placeholder="Reply to WebGen.ai"
                    className="flex-1 resize-none rounded-2xl px-4 py-3 bg-white/5 border border-white/10 text-sm text-white placeholder-zinc-500 outline-none focus:ring-2 focus:ring-indigo-400/40"
                    onChange={(e) => setPrompt(e.target.value)}
                    value={prompt}
                  />
                  <button
                    className="px-4 py-3 rounded-2xl bg-indigo-500 text-white hover:bg-indigo-600 transition"
                    disabled={updateLoading}
                    onClick={handleUpdate}
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCode && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="fixed inset-y-0 right-0 w-full lg:w-[45%] z-[9999] bg-[#020617] border-l border-white/10 flex flex-col shadow-2xl"
          >
            <div className="h-12 px-4 flex justify-between items-center border-b border-white/10 bg-[#020617]/90 backdrop-blur-xl">
              <span className="text-sm font-medium text-zinc-300">
                index.html
              </span>

              <button
                onClick={() => setShowCode(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition"
              >
                <X size={18} />
              </button>
            </div>
            <Editor
              theme="vs-dark"
              value={code}
              language="html"
              onChange={(v) => setCode(v)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFullPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-[#020617] flex flex-col"
          >
            {/* Top preview bar */}
            <div className="h-12 px-4 flex items-center justify-between border-b border-white/10 bg-black/70 backdrop-blur-md">
              <span className="text-sm text-zinc-300">Live Preview</span>

              <button
                onClick={() => setShowFullPreview(false)}
                className="p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/10 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Website preview */}
            <iframe srcDoc={code} sandbox='allow-scripts allow-same-origin allow-forms' className="flex-1 w-full bg-white" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
  function Header({onclose}) {
    return (
      <div className="h-14 px-4 flex items-center justify-between border-b border-white/10">
        <span className="font-semibold truncate">{website.title}</span>
        {onclose && <button onClick={onclose}><X size={18} color="white"/></button>} 
      </div>
    );
  }
};

export default WebsiteEditor;
