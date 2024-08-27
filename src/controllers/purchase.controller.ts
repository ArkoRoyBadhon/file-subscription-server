import catchAsyncError from "../middlewares/catchAsyncErrors";
import Plan from "../models/plan.model";
import PurchasedPlan from "../models/purchasedPlan";
import User from "../models/user.model";

export const purchasePlanController = catchAsyncError(
  async (req, res, next) => {
    const { userId, plan: planId, limit } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    const already = await PurchasedPlan.findOne({ userId });
    const deletePlan = await PurchasedPlan.deleteOne({ userId });

    const purchasedPlan = await PurchasedPlan.create({
      limit: plan.limit,
      userId: userId,
      plan: planId,
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        // plan: purchasedPlan._id,
        plan: planId,
        planDate: new Date(),
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Plan purchased successfully",
      data: {
        user: updatedUser,
        purchasedPlan,
      },
    });
  }
);

export const getPurchasedPlansByUserController = catchAsyncError(
  async (req, res, next) => {
    if (!req.user || !req.user._id) {
      return res.status(400).json({
        success: false,
        message: "User ID is missing or invalid",
      });
    }

    const { _id } = req.user;

    const purchasedPlans = await PurchasedPlan.findOne({
      userId: _id,
    })
    // .populate("plan");

    
    if (!purchasedPlans) {
      return res.status(404).json({
        success: false,
        message: "No purchased plans found for this user",
      });
    }

    return res.status(200).json({
      success: true,
      data: purchasedPlans,
    });
  }
);
