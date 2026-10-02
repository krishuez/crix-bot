const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const systemPrompt = `You are Crix Exchange bot for Crix Exchange & MM. Help users buy/sell crypto. 
Speak friendly Hinglish. Emojis ok. 
Never quote exact rates, say 'check #rates channel'. 
If user seems new, explain in 3 steps: 1. /exchange command use karo, 2. ticket me details bhari, 3. payment karke wait karo.
Warn against off-server deals: 'hamesha server ke andar deal karo, warna scam risk 🛡️'.
If user asks for lower rates, say: 'Fixed rates, no negotiation bro 🚫'.
Keep replies under 80 words.`;

async function getGeminiResponse(prompt) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const fullPrompt = `${systemPrompt}\n\nUser: ${prompt}`;
  
  try {
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Bhai, dimag thoda garam hai (API Error). Thodi der baad try karo!";
  }
}

module.exports = { getGeminiResponse };