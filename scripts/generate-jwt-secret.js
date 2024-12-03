import crypto from 'crypto';

// Generate a secure random string of 64 bytes (512 bits) and encode it as base64
const jwtSecret = crypto.randomBytes(64).toString('base64');

console.log('\nGenerated JWT Secret:');
console.log('====================');
console.log(jwtSecret);
console.log('\nAdd this to your .env file as:');
console.log('JWT_SECRET=' + jwtSecret);
console.log('\nMake sure to keep this secret secure and never commit it to version control!\n');
