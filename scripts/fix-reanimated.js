const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Define directories to remove
const directoriesToRemove = [
  '.expo',
  'node_modules/.cache',
];

// Define commands to run
const commandsToRun = [
  'watchman watch-del-all',
  'rm -rf node_modules',
  'yarn install', // or 'npm install' if you use npm
  'expo start --clear',
];

console.log('🧹 Fixing Reanimated issues...');

// Remove directories
directoriesToRemove.forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  if (fs.existsSync(dirPath)) {
    console.log(`Removing ${dir}...`);
    try {
      fs.rmSync(dirPath, { recursive: true, force: true });
    } catch (error) {
      console.error(`Error removing ${dir}: ${error.message}`);
    }
  }
});

// Run commands
commandsToRun.forEach(command => {
  console.log(`Running: ${command}`);
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Error running command: ${error.message}`);
  }
});

console.log('✅ Reanimated fix complete!');
console.log('If you still encounter issues, try:');
console.log('1. Restart your development server');
console.log('2. Rebuild your app with `expo prebuild --clean && expo run:ios` (or android)');
console.log('3. Check the Reanimated troubleshooting guide: https://docs.swmansion.com/react-native-reanimated/docs/guides/troubleshooting');
