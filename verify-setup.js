// Verification script for CampusEvents project setup
const fs = require('fs');
const path = require('path');

console.log('=== CampusEvents Project Structure Verification ===\n');

// Check backend structure
console.log('Backend Structure:');
const backendDirs = ['controllers', 'middleware', 'models', 'routes'];
backendDirs.forEach(dir => {
    const exists = fs.existsSync(path.join('backend', dir));
    console.log(`  ${exists ? '✓' : '✗'} backend/${dir}`);
});

// Check backend files
const backendFiles = [
    'backend/server.js',
    'backend/package.json',
    'backend/.env',
    'backend/.env.example',
    'backend/.gitignore'
];
backendFiles.forEach(file => {
    const exists = fs.existsSync(file);
    console.log(`  ${exists ? '✓' : '✗'} ${file}`);
});

// Check frontend structure
console.log('\nFrontend Structure:');
const frontendDirs = [
    'frontend/src/app/components',
    'frontend/src/app/services',
    'frontend/src/app/guards',
    'frontend/src/environments'
];
frontendDirs.forEach(dir => {
    const exists = fs.existsSync(dir);
    console.log(`  ${exists ? '✓' : '✗'} ${dir}`);
});

// Check frontend files
const frontendFiles = [
    'frontend/package.json',
    'frontend/angular.json',
    'frontend/src/app/app.routes.ts',
    'frontend/src/app/app.config.ts',
    'frontend/src/environments/environment.ts',
    'frontend/src/environments/environment.prod.ts'
];
frontendFiles.forEach(file => {
    const exists = fs.existsSync(file);
    console.log(`  ${exists ? '✓' : '✗'} ${file}`);
});

// Check root files
console.log('\nRoot Files:');
const rootFiles = ['.gitignore', 'README.md'];
rootFiles.forEach(file => {
    const exists = fs.existsSync(file);
    console.log(`  ${exists ? '✓' : '✗'} ${file}`);
});

console.log('\n=== Verification Complete ===');
