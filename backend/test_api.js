const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
let token = '';
let userId = '';
let eventId = '';

async function runTests() {
    try {
        console.log('--- Starting API Tests ---');

        // 1. Register User
        console.log('\n1. Testing Registration...');
        const uniqueEmail = `testuser${Date.now()}@example.com`;
        try {
            const regRes = await axios.post(`${API_URL}/auth/register`, {
                name: 'Test User',
                email: uniqueEmail,
                password: 'password123'
            });
            console.log('✅ Registration Successful:', regRes.data);
        } catch (error) {
            console.error('❌ Registration Failed:', error.response ? error.response.data : error.message);
        }

        // 2. Login User
        console.log('\n2. Testing Login...');
        try {
            const loginRes = await axios.post(`${API_URL}/auth/login`, {
                email: uniqueEmail,
                password: 'password123'
            });
            console.log('✅ Login Successful');
            token = loginRes.data.token;
            userId = loginRes.data.user.id;
            // console.log('Token:', token);
        } catch (error) {
            console.error('❌ Login Failed:', error.response ? error.response.data : error.message);
            return; // Stop if login fails
        }

        const authHeaders = {
            headers: { 'x-auth-token': token }
        };

        // 3. Create Event
        console.log('\n3. Testing Create Event...');
        try {
            const eventRes = await axios.post(`${API_URL}/events`, {
                title: 'Test Event',
                description: 'This is a test event',
                date: '2023-12-25',
                time: '10:00 AM',
                venue: 'Test Venue',
                category: 'Tech',
                bannerUrl: 'http://example.com/banner.jpg'
            }, authHeaders);
            console.log('✅ Create Event Successful:', eventRes.data.title);
            eventId = eventRes.data._id;
        } catch (error) {
            console.error('❌ Create Event Failed:', error.response ? error.response.data : error.message);
        }

        // 4. Get All Events
        console.log('\n4. Testing Get All Events...');
        try {
            const getEventsRes = await axios.get(`${API_URL}/events`);
            console.log(`✅ Get All Events Successful. Count: ${getEventsRes.data.length}`);
        } catch (error) {
            console.error('❌ Get All Events Failed:', error.response ? error.response.data : error.message);
        }

        // 5. Get Single Event
        console.log('\n5. Testing Get Single Event...');
        try {
            const getEventRes = await axios.get(`${API_URL}/events/${eventId}`);
            console.log('✅ Get Single Event Successful:', getEventRes.data.title);
        } catch (error) {
            console.error('❌ Get Single Event Failed:', error.response ? error.response.data : error.message);
        }

        // 6. Update Event
        console.log('\n6. Testing Update Event...');
        try {
            const updateRes = await axios.put(`${API_URL}/events/${eventId}`, {
                title: 'Updated Test Event'
            }, authHeaders);
            console.log('✅ Update Event Successful:', updateRes.data.title);
        } catch (error) {
            console.error('❌ Update Event Failed:', error.response ? error.response.data : error.message);
        }

        // 7. Register for Event
        // Note: Usually you can't register for your own event if logic forbids it, but our controller doesn't explicitly forbid it, 
        // only checks if already registered. Let's try.
        console.log('\n7. Testing Register for Event...');
        try {
            const regEventRes = await axios.post(`${API_URL}/registrations`, {
                eventId: eventId
            }, authHeaders);
            console.log('✅ Register for Event Successful:', regEventRes.data);
        } catch (error) {
            console.error('❌ Register for Event Failed:', error.response ? error.response.data : error.message);
        }

        // 8. Get My Registrations
        console.log('\n8. Testing Get My Registrations...');
        try {
            const myRegRes = await axios.get(`${API_URL}/registrations/my`, authHeaders);
            console.log(`✅ Get My Registrations Successful. Count: ${myRegRes.data.length}`);
        } catch (error) {
            console.error('❌ Get My Registrations Failed:', error.response ? error.response.data : error.message);
        }

        // 9. Delete Event
        console.log('\n9. Testing Delete Event...');
        try {
            const deleteRes = await axios.delete(`${API_URL}/events/${eventId}`, authHeaders);
            console.log('✅ Delete Event Successful:', deleteRes.data.message);
        } catch (error) {
            console.error('❌ Delete Event Failed:', error.response ? error.response.data : error.message);
        }

        console.log('\n--- API Tests Completed ---');

    } catch (error) {
        console.error('Unexpected Error:', error);
    }
}

runTests();
