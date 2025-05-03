const fs = require('fs');
const path = require('path');

const envContent = `GEMINI_API_KEY=AIzaSyCel8tvH09EfdDrGhPr1uuxdw9cW4B6ot8
JWT_SECRET=your-super-secret-jwt-key-keep-it-safe
MONGODB_URI=mongodb://localhost:27017/quickhire
`;

const envPath = path.resolve(__dirname, '../.env');

try {
    // Write file with UTF-8 encoding without BOM
    fs.writeFileSync(envPath, envContent, { encoding: 'utf8' });
    console.log('✓ Created .env file successfully at:', envPath);
    
    // Verify the file was written correctly
    const content = fs.readFileSync(envPath, 'utf8');
    console.log('\nFile content verification:');
    console.log(content);
} catch (error) {
    console.error('Error creating .env file:', error);
} 