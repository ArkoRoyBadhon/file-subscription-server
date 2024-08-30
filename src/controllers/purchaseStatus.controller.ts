import { Request, Response } from "express";
import PurchaseStatus from "../models/purchaseStatus.model";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const getPurchaseStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user || !req.user._id) {
      res.status(400).json({ message: "User ID is missing or invalid" });
      return;
    }

    const userId = req.user._id;
    const priceId = req.query.priceId as string;
    const name = req.query.name as string;

    console.log("query", req.query);
    

    if (!priceId || !name) {
      res
        .status(400)
        .json({ message: "priceId and name query parameters are required" });
      return;
    }

    const purchaseStatus = await PurchaseStatus.findOne({ userId });

    if (!purchaseStatus) {
      res
        .status(404)
        .json({ message: "No purchase status found for this user" });
      return;
    }

    let prevPriceId = purchaseStatus.packageId;
    const prices = await stripe.prices.list();

    if (!prices.data) {
      res
        .status(500)
        .json({ message: "Failed to retrieve prices from Stripe" });
      return;
    }

    const selectedPrice = prices.data.find((price) => price.id === priceId);
    if (!selectedPrice) {
      res.status(404).json({ message: "Price not found" });
      return;
    }

    const packageName = selectedPrice.nickname || "Unknown Package";

    if (prevPriceId !== priceId) {
      purchaseStatus.packageId = priceId;
      purchaseStatus.packageName = name;
      purchaseStatus.freeDownloadCount = 0;
      purchaseStatus.paidDownloadCount = 0;

      if (packageName === "Basic") {
        purchaseStatus.remainingDownloadCount = 2;
      } else if (packageName === "Standard") {
        purchaseStatus.remainingDownloadCount = 50;
      } else if (packageName === "Premium") {
        purchaseStatus.remainingDownloadCount = 100;
      } else {
        purchaseStatus.remainingDownloadCount = 0;
      }

      await purchaseStatus.save();
    }

    res.status(200).json({
      success: true,
      data: purchaseStatus,
    });
  } catch (error: any) {
    console.error("Error in getPurchaseStatus:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// export const getPurchaseStatus = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     if (!req.user || !req.user._id) {
//       res.status(400).json({ message: "User ID is missing" });
//       return;
//     }
//     if (!req.user) {
//       res.status(400).json({ message: "User ID is required" });
//       return;
//     }

//     const { priceId, name } = req.query;

//     const purchaseStatuses = await PurchaseStatus.findOne({
//       userId: req.user._id,
//     });

//     if (!purchaseStatuses) {
//       res
//         .status(404)
//         .json({ message: "No purchase status found for this user" });
//       return;
//     }

//     // purchaseStatuses.save();

//     const prices = await stripe.prices.list();

//     if (!prices.data) {
//       res
//         .status(404)
//         .json({ message: "No purchase status found for this user" });
//       return;
//     }

//     let nam = "";
//     for (let i = 0; i < prices.data.length; i++) {
//       if (prices.data[i].id == priceId) {
//         nam = prices.data[i].nickname!;
//       }
//     }

//     let prevPriceId = purchaseStatuses.packageId;
//     console.log(prevPriceId);

//     purchaseStatuses && purchaseStatuses.packageId = priceId;
//     purchaseStatuses.packageName = name;

//     if (nam === "Basic") {
//       purchaseStatuses.remainingDownloadCount = 2;
//     } else if (nam === "Standard") {
//       purchaseStatuses.remainingDownloadCount = 50;
//     } else if (nam === "Premium") {
//       purchaseStatuses.remainingDownloadCount = 100;
//     }
//     // purchaseStatuses.save();

//     console.log("aaaaaaaaa", priceId);
//     // console.log("aaaaaaaaa", purchaseStatuses);

//     res.status(200).json({
//       success: true,
//       data: purchaseStatuses,
//     });
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// };
