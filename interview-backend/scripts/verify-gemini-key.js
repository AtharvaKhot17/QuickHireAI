require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function verifyGeminiKey() {
  console.log('\nVerifying Gemini API Key:');
  console.log('------------------------');

  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not found in environment variables');
    }

    console.log('API Key found:', process.env.GEMINI_API_KEY.substring(0, 10) + '...');
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-lite-001"  // Updated to Flash-Lite model
    });

    console.log('\nTesting API connection...');
    console.log('Model version: gemini-2.0-flash-lite-001');
    
    const result = await model.generateContent("Say 'Hello!'");
    const response = await result.response;
    const text = response.text();
    
    console.log('✓ API Key is valid!');
    console.log('✓ Model connection successful!');
    console.log('Test response:', text);
  } catch (error) {
    console.log('✗ API Key verification failed!');
    console.error('Error:', error.message);
    if (error.message.includes('404')) {
      console.log('\nModel version error. Please verify:');
      console.log('1. You are using the correct model version (gemini-2.0-flash-lite-001)');
      console.log('2. Your API key has access to this model');
      console.log('3. The model is available in your region');
    } else if (error.message.includes('API_KEY_INVALID')) {
      console.log('\nPlease ensure you have:');
      console.log('1. Created an API key at https://makersuite.google.com/app/apikey');
      console.log('2. Copied the entire key correctly');
      console.log('3. Added the key to your .env file');
      console.log('4. Enabled the Gemini API in your Google Cloud Console');
    }
  }
}

verifyGeminiKey(); 