require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testGemini() {
  console.log('\nTesting Gemini Connection:');
  console.log('------------------------');

  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Gemini API key is missing');
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = "Generate a simple technical interview question about JavaScript.";
    const result = await model.generateContent(prompt);
    const response = await result.response;

    console.log('✓ Gemini connection successful!');
    console.log('Response:', response.text());
  } catch (error) {
    console.log('✗ Gemini connection failed!');
    console.log('Error:', error.message);
  }
}

testGemini(); 