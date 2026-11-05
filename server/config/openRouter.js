// const openRouterUrl = "https://openrouter.ai/api/v1/chat/completions";
// const model = "deepseek/deepseek-chat";

// export const generateResponse = async (prompt) => {
//   const res = await fetch(openRouterUrl, {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       model: model,
//       messages: [
//         {
//           role: "system",
//           content: "You must return only valid raw JSON",
//         },
//         {
//           role: "user",
//           content: prompt,
//         },
//       ],
//       temperature: 0.2,
//       max_token: 2000
//     }),
//   });

//   if(!res.ok) {
//     const err = await res.text()
//     throw new Error("openRouter err" + err)
//   }

//   const data = await res.json()
//   return data.choices[0].message.content
// };

// // const openRouterApiKey =

// const openRouterUrl = "https://openrouter.ai/api/v1/chat/completions";
// const model = "deepseek/deepseek-chat";

// export const generateResponse = async (prompt) => {
//   const res = await fetch(openRouterUrl, {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       model: model,
//       messages: [
//         {
//           role: "system",
//           content: "You must return only valid raw JSON",
//         },
//         {
//           role: "user",
//           content: prompt,
//         },
//       ],
//       temperature: 0.2,
//       max_tokens: 2000
//     }),
//   });

//   if (!res.ok) {
//     const err = await res.text();
//     throw new Error("openRouter err " + err);
//   }

//   const data = await res.json();
//   return data.choices[0].message.content;
// };


const openRouterUrl = "https://openrouter.ai/api/v1/chat/completions";
const model = "deepseek/deepseek-chat";

export const generateResponse = async (prompt) => {

  const res = await fetch(openRouterUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: "system",
          content: `
Return ONLY valid JSON.

Format exactly like this:

{
 "message": "short message",
 "code": "<complete HTML here>"
}

Do NOT cut the HTML.
Do NOT add markdown.
Do NOT add explanations.
Return full HTML.
`
        },
        {
          role: "user",
          content: prompt,
        },
      ],

      temperature: 0.2,
      max_tokens: 4000
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error("OpenRouter Error: " + err);
  }

  const data = await res.json();

  return data.choices?.[0]?.message?.content || "";
};