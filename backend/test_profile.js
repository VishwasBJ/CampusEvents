const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test user credentials
const testUser = {
    name: 'Profile Test User',
    email: 'profiletest@example.com',
    password: 'password123'
};

let authToken = '';

async function testProfileEndpoints() {
    try {
        console.log('=== Testing User Profile Endpoints ===\n');

        // 1. Register a test user
        console.log('1. Registering test user...');
        try {
            const registerRes = await axios.post(`${BASE_URL}/auth/register`, testUser);
            authToken = registerRes.data.token;
            console.log('✓ User registered successfully');
            console.log('  Token:', authToken.substring(0, 20) + '...');
        } catch (err) {
            if (err.response?.data?.message?.includes('already exists')) {
                // User exists, try to login
                console.log('  User already exists, logging in...');
                const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
                    email: testUser.email,
                    password: testUser.password
                });
                authToken = loginRes.data.token;
                console.log('✓ Logged in successfully');
            } else {
                throw err;
            }
        }

        // 2. Get user profile
        console.log('\n2. Getting user profile...');
        const profileRes = await axios.get(`${BASE_URL}/auth/profile`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('✓ Profile retrieved successfully');
        console.log('  Name:', profileRes.data.user.name);
        console.log('  Email:', profileRes.data.user.email);
        console.log('  Created:', new Date(profileRes.data.user.createdAt).toLocaleString());

        // 3. Test GET profile without token (should fail)
        console.log('\n3. Testing GET profile without token (should fail)...');
        try {
            await axios.get(`${BASE_URL}/auth/profile`);
            console.log('✗ FAILED: Should have rejected request without token');
        } catch (err) {
            if (err.response?.status === 401) {
                console.log('✓ Correctly rejected request without token');
                console.log('  Error:', err.response.data.message);
            } else {
                throw err;
            }
        }

        // 4. Update profile - change name
        console.log('\n4. Updating profile (name only)...');
        const updateRes1 = await axios.put(`${BASE_URL}/auth/profile`, 
            { name: 'Updated Profile Name' },
            { headers: { Authorization: `Bearer ${authToken}` } }
        );
        console.log('✓ Profile updated successfully');
        console.log('  New name:', updateRes1.data.user.name);
        console.log('  Email unchanged:', updateRes1.data.user.email);

        // 5. Update profile - change email
        console.log('\n5. Updating profile (email only)...');
        const newEmail = 'updated_' + testUser.email;
        const updateRes2 = await axios.put(`${BASE_URL}/auth/profile`, 
            { email: newEmail },
            { headers: { Authorization: `Bearer ${authToken}` } }
        );
        console.log('✓ Profile updated successfully');
        console.log('  Name unchanged:', updateRes2.data.user.name);
        console.log('  New email:', updateRes2.data.user.email);

        // 6. Update profile - change both name and email
        console.log('\n6. Updating profile (both name and email)...');
        const updateRes3 = await axios.put(`${BASE_URL}/auth/profile`, 
            { name: 'Final Test Name', email: testUser.email },
            { headers: { Authorization: `Bearer ${authToken}` } }
        );
        console.log('✓ Profile updated successfully');
        console.log('  New name:', updateRes3.data.user.name);
        console.log('  New email:', updateRes3.data.user.email);

        // 7. Test email uniqueness validation
        console.log('\n7. Testing email uniqueness validation...');
        // First create another user
        const anotherUser = {
            name: 'Another User',
            email: 'another@example.com',
            password: 'password123'
        };
        try {
            await axios.post(`${BASE_URL}/auth/register`, anotherUser);
            console.log('  Created another user for testing');
        } catch (err) {
            if (!err.response?.data?.message?.includes('already exists')) {
                throw err;
            }
        }
        
        // Try to update profile with existing email
        try {
            await axios.put(`${BASE_URL}/auth/profile`, 
                { email: anotherUser.email },
                { headers: { Authorization: `Bearer ${authToken}` } }
            );
            console.log('✗ FAILED: Should have rejected duplicate email');
        } catch (err) {
            if (err.response?.status === 400 && err.response?.data?.message?.includes('already in use')) {
                console.log('✓ Correctly rejected duplicate email');
                console.log('  Error:', err.response.data.message);
            } else {
                throw err;
            }
        }

        // 8. Test invalid email format
        console.log('\n8. Testing invalid email format validation...');
        try {
            await axios.put(`${BASE_URL}/auth/profile`, 
                { email: 'invalid-email' },
                { headers: { Authorization: `Bearer ${authToken}` } }
            );
            console.log('✗ FAILED: Should have rejected invalid email format');
        } catch (err) {
            if (err.response?.status === 400) {
                console.log('✓ Correctly rejected invalid email format');
                console.log('  Error:', err.response.data.message || err.response.data.errors);
            } else {
                throw err;
            }
        }

        // 9. Test PUT profile without token (should fail)
        console.log('\n9. Testing PUT profile without token (should fail)...');
        try {
            await axios.put(`${BASE_URL}/auth/profile`, { name: 'Test' });
            console.log('✗ FAILED: Should have rejected request without token');
        } catch (err) {
            if (err.response?.status === 401) {
                console.log('✓ Correctly rejected request without token');
                console.log('  Error:', err.response.data.message);
            } else {
                throw err;
            }
        }

        // 10. Verify final profile state
        console.log('\n10. Verifying final profile state...');
        const finalProfileRes = await axios.get(`${BASE_URL}/auth/profile`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('✓ Final profile retrieved');
        console.log('  Name:', finalProfileRes.data.user.name);
        console.log('  Email:', finalProfileRes.data.user.email);
        console.log('  Updated:', new Date(finalProfileRes.data.user.updatedAt).toLocaleString());

        console.log('\n=== All Profile Tests Passed! ===');

    } catch (error) {
        console.error('\n✗ Test failed:', error.response?.data || error.message);
        process.exit(1);
    }
}

// Run tests
testProfileEndpoints();
