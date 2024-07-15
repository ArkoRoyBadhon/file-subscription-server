import { validationResult } from "express-validator";
import catchAsyncError from "../middlewares/catchAsyncErrors";
import Plan from "../models/plan.model";

export const createPlanController = catchAsyncError(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation errors",
      errors: errors.array(),
    });
  }

  const { limit, price, name, expire } = req.body;

  const existingPlan = await Plan.findOne({ name });
  if (existingPlan) {
    return res.json({
      success: false,
      duplicate: true,
      message: "Plan name already in use",
      data: null,
    });
  }

  const plan = await Plan.create({
    limit,
    price,
    name,
    expire,
  });

  return res.json({
    success: true,
    message: "Plan created successfully",
    data: plan,
  });
});

export const getPlansController = catchAsyncError(async (req, res, next) => {
  const plans = await Plan.find();

  return res.json({
    success: true,
    message: "Plans fetched successfully",
    data: plans,
  });
});

export const updatePlanController = catchAsyncError(async (req, res, next) => {
  const { planId } = req.params;
  const { limit, price, name, expire } = req.body;

  const updatedPlan = await Plan.findByIdAndUpdate(
    planId,
    { limit, price, name, expire },
    { new: true }
  );

  if (!updatedPlan) {
    return res.json({
      success: false,
      message: "Plan not found",
      data: null,
    });
  }

  return res.json({
    success: true,
    message: "Plan updated successfully",
    data: updatedPlan,
  });
});

export const deletePlanController = catchAsyncError(async (req, res, next) => {
  const { planId } = req.params;

  const deletedPlan = await Plan.findByIdAndDelete(planId);

  if (!deletedPlan) {
    return res.json({
      success: false,
      message: "Plan not found",
      data: null,
    });
  }

  return res.json({
    success: true,
    message: "Plan deleted successfully",
    data: deletedPlan,
  });
});
