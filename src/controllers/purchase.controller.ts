import catchAsyncError from "../middlewares/catchAsyncErrors";
import Plan from "../models/plan.model";
import PurchasedPlan from "../models/purchasedPlan";
import User from "../models/user.model";

export const purchasePlanController = catchAsyncError(async (req, res, next) => {
    const { userId, planId } = req.body;
  
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

    const already = await PurchasedPlan.findOne({plan: planId})

    if (already) {
        return res.status(400).json({
          success: false,
          message: "Already Purchased! Upgrade your subscription!",
        });
      }
  
    const purchasedPlan = await PurchasedPlan.create({
      limit: plan.limit,
      userId: userId,
      plan: planId,
    });
  
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        plan: purchasedPlan._id, 
        planDate: new Date() 
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
  });