import { Queue } from "bullmq";
import client from "../../Config/redisConnect.js";
import { ScrapingRoutes } from "../ScrapingRoutes.js";

const scrapeQueue = new Queue("ScrapingJobs", {
  connection: client,
});

const currentDate = new Date();

const formattedDate = currentDate.toISOString().split("T")[0];

const oneMonthDate = new Date(currentDate);
oneMonthDate.setMonth(oneMonthDate.getMonth() + 1);

const oneMonthAfterDate = oneMonthDate.toISOString().split("T")[0];

const airlines = ["akasa", "airindia", "spicejet"];

let expectedTotalJobs = 0;

async function addJobs() {
  await scrapeQueue.drain(true);
  const totalJobs = airlines.length * ScrapingRoutes.length;
  expectedTotalJobs = totalJobs;
  console.log(`Total jobs to be queued: ${totalJobs}`);
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

  console.log("All jobs have been queued. Starting progress monitor...");

  // Periodically log remaining jobs and stop when all are finished
  const intervalId = setInterval(async () => {
    try {
      const done = await logRemainingJobs();
      if (done) {
        clearInterval(intervalId);
      }
    } catch (err) {
      console.error("Error while checking remaining jobs:", err.message);
    }
  }, 5000);
}

export async function logRemainingJobs() {
  const counts = await scrapeQueue.getJobCounts(
    "waiting",
    "active",
    "delayed",
    "failed",
    "completed",
  );

  const waiting = counts.waiting || 0;
  const active = counts.active || 0;
  const delayed = counts.delayed || 0;
  const completed = counts.completed || 0;
  const failed = counts.failed || 0;

  const remaining = waiting + active + delayed;

  console.log(
    `Jobs remaining: ${remaining} (waiting: ${waiting}, active: ${active}, delayed: ${delayed}, completed: ${completed}, failed: ${failed})`,
  );

  if (remaining === 0 && expectedTotalJobs > 0) {
    console.log("All scraping jobs are finished.");
    return true;
  }

  return false;
}

addJobs();
