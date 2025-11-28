const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/auth';

// Test data
const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
};

async function testAuthentication() {
    console.log('Starting authentication tests...\n');

    try {
        // Test 1: Register a new user
        console.log('Test 1: Register new user');
        try {
            const registerResponse = await axios.post(`${BASE_URL}/register`, testUser);
            console.log('✓ Registration successful');
            console.log('Response:', registerResponse.data);
            console.log('Token received:', registerResponse.data.token ? 'Yes' : 'No');
            console.log('');
        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.data.message.includes('already exists')) {
                console.log('✓ User already exists (expected if running test multiple times)');
                console.log('');
            } else {
                throw error;
            }
        }

        // Test 2: Login with correct credentials
        console.log('Test 2: Login with correct credentials');
        const loginResponse = await axios.post(`${BASE_URL}/login`, {
            email: testUser.email,
            password: testUser.password
        });
        console.log('✓ Login successful');
        console.log('Response:', loginResponse.data);
        console.log('Token received:', loginResponse.data.token ? 'Yes' : 'No');
        const token = loginResponse.data.token;
        console.log('');

        // Test 3: Login with incorrect password
        console.log('Test 3: Login with incorrect password');
        try {
            await axios.post(`${BASE_URL}/login`, {
                email: testUser.email,
                password: 'wrongpassword'
            });
            console.log('✗ Should have failed but succeeded');
        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.log('✓ Login correctly rejected with invalid credentials');
                console.log('Error message:', error.response.data.message);
            } else {
                throw error;
            }
        }
        console.log('');

        // Test 4: Login with non-existent email
        console.log('Test 4: Login with non-existent email');
        try {
            await axios.post(`${BASE_URL}/login`, {
                email: 'nonexistent@example.com',
                password: 'password123'
            });
            console.log('✗ Should have failed but succeeded');
        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.log('✓ Login correctly rejected for non-existent user');
                console.log('Error message:', error.response.data.message);
            } else {
                throw error;
            }
        }
        console.log('');

        // Test 5: Register with duplicate email
        console.log('Test 5: Register with duplicate email');
        try {
            await axios.post(`${BASE_URL}/register`, testUser);
            console.log('✗ Should have failed but succeeded');
        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.log('✓ Registration correctly rejected for duplicate email');
                console.log('Error message:', error.response.data.message);
            } else {
                throw error;
            }
        }
        console.log('');

        // Test 6: Register with invalid email
        console.log('Test 6: Register with invalid email');
        try {
            await axios.post(`${BASE_URL}/register`, {
                name: 'Test User 2',
                email: 'invalidemail',
                password: 'password123'
            });
            console.log('✗ Should have failed but succeeded');
        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.log('✓ Registration correctly rejected for invalid email');
                console.log('Error message:', error.response.data.message);
            } else {
                throw error;
            }
        }
        console.log('');

        console.log('All authentication tests completed successfully! ✓');

    } catch (error) {
        console.error('Test failed:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
        process.exit(1);
    }
}

// Run tests
console.log('Make sure the server is running on http://localhost:5000');
console.log('You can start it with: cd backend && npm run dev\n');

testAuthentication();
