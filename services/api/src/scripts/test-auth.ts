
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

async function testAuth() {
    try {
        console.log('Testing Login...');
        const loginResponse = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@campus.edu',
            password: 'password123'
        });

        console.log('Login Successful!');
        const token = loginResponse.data.accessToken;
        console.log('Access Token received');

        console.log('Testing /me endpoint...');
        const meResponse = await axios.get(`${API_URL}/auth/me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log('/me Successful!');
        console.log('User:', meResponse.data.user);

    } catch (error: any) {
        console.error('Auth Test Failed:', error.response?.data || error.message);
        process.exit(1);
    }
}

testAuth();
