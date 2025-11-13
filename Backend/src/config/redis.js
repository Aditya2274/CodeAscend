import { createClient } from 'redis';
import dotenv from 'dotenv'
dotenv.config()
const client = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-15899.c305.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 15899
    }
});

client.on('error', err => console.log('Redis Client Error', err));

export default client 