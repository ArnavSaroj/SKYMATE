import { Worker } from "bullmq";
import client from "../../Config/redisConnect.js";
import axios from "axios";

async function callAirlineApi(airline, route) {
  try {
    const res = await axios.post(
      `http://localhost:5000/flights/${airline}/StoreGet`,
      route,
      {
        headers: {
          "Content-type": "application/json",
        },
      },
    );

    if (res.status < 200 || res.status >= 300) {
      throw new Error("API failed");
    }

    const data = res.data;
    console.log(
      `Job Completed: AirIndia ${route.origin} → ${route.destination}`,
    );
    if (data && typeof data === "object") {
      console.log(`Inserted: ${data.inserted || 0}`);
      console.log(`Errors: ${data.errors || 0}`);
      console.log(`Total: ${data.total || 0}`);
      if (data.message) {
        console.log(`Message: ${data.message}`);
      }
    } else {
      console.log("Response data:", data);
    }
  } catch (err) {
    console.error(
      `${airline} job failed for ${route.origin} → ${route.destination}`,
    );
    if (err.response && err.response.data) {
      console.error("API Error Response:", err.response.data);
    } else {
      console.error("Error:", err.message);
    }
  }
}

const worker = new Worker(
  "ScrapingJobs",
  async (Job) => {
    const route = Job.data;
    const airline = route.airline;
    const supportedAirlines = ["airindia", "akasa", "spicejet"];

    if (!supportedAirlines.includes(airline)) {
      throw new Error("Unsupported airline");
    }
    await callAirlineApi(airline, route);
  },
  { connection: client, concurrency: 5 },
);
