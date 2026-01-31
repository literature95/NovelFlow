const jwt = require('jsonwebtoken');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWpmeHFheXgwMDA1YThzZzY3bDBreHUzIiwidXNlcm5hbWUiOiJ0ZXN0dXNlciIsImlhdCI6MTc2NjMzNzI4MCwiZXhwIjoxNzY2OTQyMDgwfQ.PcXE3kOseD8UJXTMrv_kaoaiMQUBqY3BHHjJhZrZt8M';
const secret = 'your-jwt-secret-key-change-this-in-production';

try {
  const decoded = jwt.verify(token, secret);
  console.log('Token验证成功:', decoded);
} catch (error) {
  console.log('Token验证失败:', error.message);
}