import { Request, Response } from "express";
import Stripe from "stripe";
import User from "../models/user.model";
import PurchaseStatus from "../models/purchaseStatus.model";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const getPrices = async (req: Request, res: Response) => {
  try {
    const prices = await stripe.prices.list();
    res.status(200).json(prices.data.reverse());
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const createSubscription = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user || !req.user._id) {
      res.status(400).json({ message: "User ID is missing" });
      return;
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: req.body.priceId,
          quantity: 1,
        },
      ],
      customer: user.stripe_customer_id!,
      success_url: process.env.STRIPE_SUCCESS_URL!,
      cancel_url: process.env.STRIPE_CANCEL_URL!,
    });

    const prices = await stripe.prices.list();

    if (!prices.data) {
      res
        .status(404)
        .json({ message: "No purchase status found for this user" });
      return;
    }
    let name = "";
    for (let i = 0; i < prices.data.length; i++) {
      if (prices.data[i].id == req.body.priceId) {
        name = prices.data[i].nickname!;
      }
    }
    let count = 0;
    if (name === "Basic") {
      count = 2;
    } else if (name === "Standard") {
      count = 50;
    } else if (name === "Premium") {
      count = 100;
    }

    const purchaseStatus = new PurchaseStatus({
      packageId: req.body.priceId,
      packageName: name,
      freeDownloadCount: 0,
      paidDownloadCount: 0,
      remainingDownloadCount: count,
      userId: req.user._id,
    });

    if (session) {
      await PurchaseStatus.deleteMany({ userId: req.user._id });
      await purchaseStatus.save();
    }

    res.status(200).json({ url: session.url });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getSubscriptionStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user || !req.user._id) {
      res.status(400).json({ message: "User ID is missing" });
      return;
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripe_customer_id!,
      status: "all",
      expand: ["data.default_payment_method"],
    });

    let filterActive = [];
    if (subscriptions) {
      for (let i = 0; i < subscriptions.data.length; i++) {
        if (!subscriptions.data[i].canceled_at) {
          filterActive.push(subscriptions.data[i]);
        }
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { subscriptions: filterActive },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllSubscriptions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user || !req.user._id) {
      res.status(400).json({ message: "User ID is missing" });
      return;
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripe_customer_id!,
      status: "all",
      expand: ["data.default_payment_method"],
    });

    let filterActive = [];
    if (subscriptions) {
      for (let i = 0; i < subscriptions.data.length; i++) {
        if (!subscriptions.data[i].canceled_at) {
          filterActive.push(subscriptions.data[i]);
        }
      }
    }

    // console.log("filterActive", filterActive);

    res.status(200).json(filterActive);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createCustomerPortal = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user || !req.user._id) {
      res.status(400).json({ message: "User ID is missing" });
      return;
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripe_customer_id!,
      return_url: process.env.STRIPE_SUCCESS_URL!,
    });

    res.status(200).json({ url: portalSession.url });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
