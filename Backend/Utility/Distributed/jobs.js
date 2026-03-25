import { Queue } from "bullmq";
import client from "../../Config/redisConnect.js";
import { ScrapingRoutes } from "../ScrapingRoutes.js";
import { fileURLToPath } from 'url';


const scrapeQueue = new Queue("ScrapingJobs", {
  connection: client,
});

const currentDate = new Date();

const formattedDate = currentDate.toISOString().split("T")[0];

const oneMonthDate = new Date(currentDate);
oneMonthDate.setMonth(oneMonthDate.getMonth() + 1);

const oneMonthAfterDate = oneMonthDate.toISOString().split("T")[0];

const airlines = ["akasa", "airindia", "spicejet"];

async function addJobs() {
  for (const airline of airlines) {
    for (const route of ScrapingRoutes) {
      await scrapeQueue.add(
        "scrape-flight",
        {
          airline: airline,
          origin: route.origin,
          destination: route.destination,
          startDate: formattedDate,
          endDate: oneMonthAfterDate,
        },
        {
          jobId: `${airline}-${route.origin}-${route.destination}-${formattedDate}`,
          attempts: 2,
          backoff: {
            type: "exponential",
            delay: 3000,
          },
        },
      );

      console.log(
        `Job  added for ${airline} Route ${route.origin}->${route.destination}`,
      );
    }
  }
}

addJobs()