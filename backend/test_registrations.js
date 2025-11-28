const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

// Test data
let authToken = '';
let userId = '';
let eventId = '';
let registrationId = '';

// Helper function to log test results
function logTest(testName, success, message) {
    console.log(`\n${success ? '✓' : '✗'} ${testName}`);
    if (message) console.log(`  ${message}`);
}

// Test Registration Management
async function testRegistrations() {
    console.log('\n=== Testing Registration Management ===\n');

    try {
        // 1. Register a new user
        console.log('1. Registering test user...');
        const registerRes = await axios.post(`${API_URL}/auth/register`, {
            name: 'Test User Registration',
            email: `test.registration.${Date.now()}@example.com`,
            password: 'password123'
        });
        authToken = registerRes.data.token;
        userId = registerRes.data.user._id;
        logTest('User Registration', true, `User ID: ${userId}`);

        // 2. Create an event (as another user to test registration)
        console.log('\n2. Creating test event...');
        const eventRes = await axios.post(
            `${API_URL}/events`,
            {
                title: 'Test Event for Registration',
                description: 'This is a test event for registration testing',
                date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
                time: '14:00',
                venue: 'Test Venue',
                category: 'Technical',
                bannerUrl: 'https://example.com/banner.jpg'
            },
            {
                headers: { Authorization: `Bearer ${authToken}` }
            }
        );
        eventId = eventRes.data.event._id;
        logTest('Event Creation', true, `Event ID: ${eventId}`);

        // 3. Register another user to register for the event
        console.log('\n3. Registering second user...');
        const register2Res = await axios.post(`${API_URL}/auth/register`, {
            name: 'Test User 2',
            email: `test.user2.${Date.now()}@example.com`,
            password: 'password123'
        });
        const user2Token = register2Res.data.token;
        logTest('Second User Registration', true, `User 2 Token obtained`);

        // 4. Register for event
        console.log('\n4. Registering for event...');
        const registerEventRes = await axios.post(
            `${API_URL}/registrations`,
            { eventId: eventId },
            {
                headers: { Authorization: `Bearer ${user2Token}` }
            }
        );
        registrationId = registerEventRes.data.registration._id;
        logTest('Event Registration', true, `Registration ID: ${registrationId}`);

        // 5. Try to register again (should fail - duplicate)
        console.log('\n5. Testing duplicate registration prevention...');
        try {
            await axios.post(
                `${API_URL}/registrations`,
                { eventId: eventId },
                {
                    headers: { Authorization: `Bearer ${user2Token}` }
                }
            );
            logTest('Duplicate Registration Prevention', false, 'Should have failed but succeeded');
        } catch (err) {
            if (err.response && err.response.status === 400) {
                logTest('Duplicate Registration Prevention', true, err.response.data.message);
            } else {
                logTest('Duplicate Registration Prevention', false, err.message);
            }
        }

        // 6. Try to register for own event (should fail)
        console.log('\n6. Testing creator registration prevention...');
        try {
            await axios.post(
                `${API_URL}/registrations`,
                { eventId: eventId },
                {
                    headers: { Authorization: `Bearer ${authToken}` }
                }
            );
            logTest('Creator Registration Prevention', false, 'Should have failed but succeeded');
        } catch (err) {
            if (err.response && err.response.status === 400) {
                logTest('Creator Registration Prevention', true, err.response.data.message);
            } else {
                logTest('Creator Registration Prevention', false, err.message);
            }
        }

        // 7. Get my registrations
        console.log('\n7. Getting user registrations...');
        const myRegsRes = await axios.get(`${API_URL}/registrations/my-registrations`, {
            headers: { Authorization: `Bearer ${user2Token}` }
        });
        logTest('Get My Registrations', true, `Found ${myRegsRes.data.count} registration(s)`);

        // 8. Get event registrations
        console.log('\n8. Getting event registrations...');
        const eventRegsRes = await axios.get(`${API_URL}/registrations/event/${eventId}`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        logTest('Get Event Registrations', true, `Found ${eventRegsRes.data.count} registration(s)`);

        // 9. Cancel registration
        console.log('\n9. Cancelling registration...');
        const cancelRes = await axios.delete(`${API_URL}/registrations/${registrationId}`, {
            headers: { Authorization: `Bearer ${user2Token}` }
        });
        logTest('Cancel Registration', true, cancelRes.data.message);

        // 10. Verify registration was cancelled
        console.log('\n10. Verifying registration cancellation...');
        const verifyRes = await axios.get(`${API_URL}/registrations/my-registrations`, {
            headers: { Authorization: `Bearer ${user2Token}` }
        });
        logTest('Verify Cancellation', verifyRes.data.count === 0, `Registrations count: ${verifyRes.data.count}`);

        console.log('\n=== All Registration Tests Completed Successfully! ===\n');

    } catch (error) {
        console.error('\n✗ Test failed with error:');
        if (error.response) {
            console.error(`  Status: ${error.response.status}`);
            console.error(`  Message: ${error.response.data.message || error.response.data}`);
        } else {
            console.error(`  ${error.message}`);
        }
    }
}

// Run tests
testRegistrations();
