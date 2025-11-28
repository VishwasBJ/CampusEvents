const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test credentials (use existing user or create one first)
const testUser = {
    email: 'test@example.com',
    password: 'password123'
};

let authToken = '';
let createdEventId = '';

async function testEventAPI() {
    try {
        console.log('=== Testing Event Management API ===\n');

        // Step 0: Register user (or login if already exists)
        console.log('0. Setting up test user...');
        try {
            const registerResponse = await axios.post(`${BASE_URL}/auth/register`, {
                name: 'Test User',
                email: testUser.email,
                password: testUser.password
            });
            authToken = registerResponse.data.token;
            console.log('✓ Test user registered');
        } catch (err) {
            if (err.response && err.response.status === 400) {
                // User already exists, login instead
                const loginResponse = await axios.post(`${BASE_URL}/auth/login`, testUser);
                authToken = loginResponse.data.token;
                console.log('✓ Test user logged in');
            } else {
                throw err;
            }
        }
        console.log(`Token: ${authToken.substring(0, 20)}...\n`);

        // Step 2: Get all events (public)
        console.log('2. Getting all events (public)...');
        const allEventsResponse = await axios.get(`${BASE_URL}/events`);
        console.log(`✓ Found ${allEventsResponse.data.count} events`);
        console.log(`Events:`, allEventsResponse.data.events.map(e => ({ id: e._id, title: e.title })));
        console.log();

        // Step 3: Create a new event (protected)
        console.log('3. Creating a new event...');
        const newEvent = {
            title: 'Test Event - Tech Talk',
            description: 'A test event for the Event Management API',
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
            time: '14:00',
            venue: 'Main Auditorium',
            category: 'Technical',
            bannerUrl: 'https://example.com/banner.jpg'
        };
        
        const createResponse = await axios.post(`${BASE_URL}/events`, newEvent, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        createdEventId = createResponse.data.event._id;
        console.log('✓ Event created successfully');
        console.log(`Event ID: ${createdEventId}`);
        console.log(`Title: ${createResponse.data.event.title}`);
        console.log(`Created by: ${createResponse.data.event.createdBy.name}\n`);

        // Step 4: Get event by ID (public)
        console.log('4. Getting event by ID...');
        const eventByIdResponse = await axios.get(`${BASE_URL}/events/${createdEventId}`);
        console.log('✓ Event retrieved successfully');
        console.log(`Title: ${eventByIdResponse.data.event.title}`);
        console.log(`Description: ${eventByIdResponse.data.event.description}\n`);

        // Step 5: Update the event (protected)
        console.log('5. Updating the event...');
        const updateData = {
            title: 'Updated Test Event - Advanced Tech Talk',
            description: 'Updated description for the test event'
        };
        
        const updateResponse = await axios.put(`${BASE_URL}/events/${createdEventId}`, updateData, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('✓ Event updated successfully');
        console.log(`New title: ${updateResponse.data.event.title}\n`);

        // Step 6: Get my events (protected)
        console.log('6. Getting my events...');
        const myEventsResponse = await axios.get(`${BASE_URL}/events/my-events`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log(`✓ Found ${myEventsResponse.data.count} events created by me`);
        console.log(`My events:`, myEventsResponse.data.events.map(e => ({ id: e._id, title: e.title })));
        console.log();

        // Step 7: Delete the event (protected)
        console.log('7. Deleting the event...');
        await axios.delete(`${BASE_URL}/events/${createdEventId}`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('✓ Event deleted successfully\n');

        // Step 8: Verify deletion
        console.log('8. Verifying deletion...');
        try {
            await axios.get(`${BASE_URL}/events/${createdEventId}`);
            console.log('✗ Event still exists (should have been deleted)');
        } catch (err) {
            if (err.response && err.response.status === 404) {
                console.log('✓ Event successfully deleted (404 Not Found)\n');
            } else {
                throw err;
            }
        }

        console.log('=== All Event API tests passed! ===');

    } catch (error) {
        console.error('\n✗ Test failed:');
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error(`Message: ${error.response.data.message}`);
            console.error(`Data:`, error.response.data);
        } else {
            console.error(error.message);
        }
        process.exit(1);
    }
}

// Run tests
testEventAPI();
