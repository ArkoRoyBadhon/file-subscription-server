import cron from "node-cron";
import PurchaseStatus from "../models/purchaseStatus.model";
import { getIO } from "../config/socket";


cron.schedule("*/10 * * * * *", async () => {
    try {
        const io = getIO();

        if (!io) {
          console.error("Socket.IO instance is not available.");
          return;
        }
    
        const dummyUserId = "your_test_user_id"; // Replace with a valid user ID for testing
        console.log(`Attempting to send notification to user ID: ${dummyUserId}`);
    
        // Send a dummy notification to the test user
        io.to(dummyUserId).emit("dummy_notification", {
          message: "This is a dummy notification for testing purposes.",
        });
    
        console.log("Dummy notification sent.");
    } catch (error) {
      console.error("Error in cron job:", error);
    }
  });

// cron.schedule("0 * * * *", async () => {
//   try {
//     const statuses = await PurchaseStatus.find({ remainingDownloadCount: { $lt: 10 } });

//     statuses.forEach(status => {
//       const io = getIO();
//       io.to(status.userId.toString()).emit("low_download_count", {
//         message: `Your remaining download count is ${status.remainingDownloadCount}. Consider upgrading your plan.`,
//       });
//     });

//     // console.log("Cron job executed and notifications sent for low download count.");
//   } catch (error) {
//     console.error("Error in cron job:", error);
//   }
// });
