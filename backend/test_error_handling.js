const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

console.log('=== Testing Error Handling Middleware ===\n');

// Helper function to make requests
async function testRequest(description, requestFn) {
    try {
        console.log(`Testing: ${description}`);
        const result = await requestFn();
        console.log('✓ Response:', JSON.stringify(result.data, null, 2));
        return result.data;
    } catch (error) {
        if (error.response) {
            console.log('✓ Error caught (expected):', JSON.stringify(error.response.data, null, 2));
            return error.response.data;
        }
        console.log('✗ Unexpected error:', error.message);
        throw error;
    }
}

async function runTests() {
    let token;

    // Test 1: Validation errors
    console.log('\n--- Test 1: Validation Errors ---');
    await testRequest('Register with missing fields', () =>
        axios.post(`${BASE_URL}/auth/register`, {
            name: '',
            email: 'invalid-email',
            password: '123'
        })
    );

    await testRequest('Create event with missing required fields', async () => {
        // First login to get token
        const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
            email: 'test@example.com',
            password: 'password123'
        });
        token = loginRes.data.token;

        return axios.post(`${BASE_URL}/events`, {
            title: '',
            description: ''
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
    });

    // Test 2: JWT errors
    console.log('\n--- Test 2: JWT Errors ---');
    await testRequest('Access protected route without token', () =>
        axios.get(`${BASE_URL}/events/my-events`)
    );

    await testRequest('Access protected route with invalid token', () =>
        axios.get(`${BASE_URL}/events/my-events`, {
            headers: { Authorization: 'Bearer invalid-token-here' }
        })
    );

    // Test 3: MongoDB CastError (invalid ObjectId)
    console.log('\n--- Test 3: MongoDB CastError ---');
    await testRequest('Get event with invalid ID format', () =>
        axios.get(`${BASE_URL}/events/invalid-id-format`)
    );

    // Test 4: Resource not found
    console.log('\n--- Test 4: Resource Not Found ---');
    await testRequest('Get event with non-existent valid ID', () =>
        axios.get(`${BASE_URL}/events/507f1f77bcf86cd799439011`)
    );

    // Test 5: Duplicate key error
    console.log('\n--- Test 5: Duplicate Key Error ---');
    await testRequest('Register with existing email', () =>
        axios.post(`${BASE_URL}/auth/register`, {
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123'
        })
    );

    // Test 6: Authorization errors
    console.log('\n--- Test 6: Authorization Errors ---');
    await testRequest('Try to update another user\'s event', async () => {
        // Create a second user
        const registerRes = await axios.post(`${BASE_URL}/auth/register`, {
            name: 'Second User',
            email: `test${Date.now()}@example.com`,
            password: 'password123'
        }).catch(() => null);

        const secondToken = registerRes?.data?.token || token;

        // Try to update the first user's event
        const eventsRes = await axios.get(`${BASE_URL}/events`);
        const firstEvent = eventsRes.data.events[0];

        if (firstEvent) {
            return axios.put(`${BASE_URL}/events/${firstEvent._id}`, {
                title: 'Hacked Event'
            }, {
                headers: { Authorization: `Bearer ${secondToken}` }
            });
        }
    });

    // Test 7: Invalid category validation
    console.log('\n--- Test 7: Invalid Category Validation ---');
    await testRequest('Create event with invalid category', () =>
        axios.post(`${BASE_URL}/events`, {
            title: 'Test Event',
            description: 'Test Description',
            date: '2025-12-31',
            time: '10:00 AM',
            venue: 'Test Venue',
            category: 'InvalidCategory'
        }, {
            headers: { Authorization: `Bearer ${token}` }
        })
    );

    console.log('\n=== All Error Handling Tests Completed ===');
}

runTests().catch(error => {
    console.error('Test suite failed:', error.message);
    process.exit(1);
});
