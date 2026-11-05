// const extractJson = async (text) => {
//   if (!text) {
//     return;
//   }
//   const cleaned = text
//     .replace(/```json/gi, "")
//     .replace(/```/g, "")
//     .trim();

//     const firstBrace = cleaned.indexOf('{')
//     const closeBrace = cleaned.lastIndexOf('}')
//     if(firstBrace === -1 || closeBrace === -1) return null
//     const jsonString = cleaned.slice(firstBrace, closeBrace+1)
//     return JSON.parse(jsonString)
// };

// export default extractJson

const extractJson = (text) => {
  if (!text) return null;

  try {

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");

    if (start === -1 || end === -1) return null;

    const jsonString = cleaned.slice(start, end + 1);

    return JSON.parse(jsonString);

  } catch (error) {

    console.log("❌ JSON PARSE ERROR:", error.message);
    console.log("❌ BROKEN AI RESPONSE:", text);

    return null;
  }
};

export default extractJson;