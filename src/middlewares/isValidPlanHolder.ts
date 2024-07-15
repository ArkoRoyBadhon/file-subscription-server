import { JwtPayload } from "jsonwebtoken";
import Plan from "../models/plan.model";
import PurchasedPlan from "../models/purchasedPlan";
import sendResponse from "../utils/sendResponse";
import catchAsyncError from "./catchAsyncErrors";

export const isValidPlanHolder = catchAsyncError(
  async (req: any, res, next) => {
    const user = req.user as JwtPayload;

    const purchasedPlan = await PurchasedPlan.findById(user.plan);
    if (!purchasedPlan) {
      return sendResponse(res, {
        data: null,
        message: "no plan found",
        success: false,
        statusCode: 404,
      });
    }

    const plan = await Plan.findById(purchasedPlan.plan);

    if (!plan) {
      return sendResponse(res, {
        data: null,
        message: "no plan found",
        success: false,
        statusCode: 404,
      });
    }

    if (!purchasedPlan.limit) {
      return sendResponse(res, {
        data: null,
        success: false,
        statusCode: 403,
        message: "You have reached your plan limit",
      });
    }

    const purchaseDate = new Date(purchasedPlan.createdAt);

    const expiryDate = new Date(purchaseDate);
    expiryDate.setDate(expiryDate.getDate() + (plan.expire || 0));

    const currentDate = new Date();

    if (plan.expire && currentDate > expiryDate) {
      return sendResponse(res, {
        data: null,
        success: false,
        statusCode: 403,
        message: "Plan has been expired",
      });
    }

    req.purchasedPlanId = purchasedPlan._id;

    next();
  }
);
