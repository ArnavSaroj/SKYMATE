import Redis from 'ioredis';

const client = new Redis();

const time=new Date
client.on("error", (err) => console.log("Redis Client Error", err));

export async function redisStart() {

  await client.set("hello", "server");
  const value = await client.get("hello");

  if (value) {
    console.log(`${value} - Redis connected successfully at ${time} 😁`);
  }
}

export default client;