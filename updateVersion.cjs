const fs = require('fs');
const path = require('path');

// Hàm để lấy thời gian hiện tại theo múi giờ UTC+7
const getUTC7Time = () => {
  const now = new Date();
  const utc7Offset = 7 * 60 * 60 * 1000; // 7 giờ tính bằng milliseconds
  const utc7Time = new Date(now.getTime() + utc7Offset);
  return utc7Time;
};

const packageJsonPath = path.join(__dirname, 'package.json');
const envPath = path.join(__dirname, '.env');
const packageJson = require(packageJsonPath);

// Lấy ngày hiện tại theo múi giờ UTC+7
const now = getUTC7Time();
const mmdd = `${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;

// Cập nhật phiên bản
packageJson.version = `v1.0.${mmdd}`;

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');

console.log(`Updated version to ${packageJson.version}`);

// Cập nhật phiên bản trong .env
let envContent = fs.readFileSync(envPath, 'utf8');
envContent = envContent.replace(/VITE_REACT_APP_VERSION=.*/, `VITE_REACT_APP_VERSION=v1.0.${mmdd}`);
fs.writeFileSync(envPath, envContent, 'utf8');
console.log(`Updated version in .env to v1.0.${mmdd}`);
