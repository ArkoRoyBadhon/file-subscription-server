"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePlanController = exports.updatePlanController = exports.getPlansController = exports.createPlanController = void 0;
const express_validator_1 = require("express-validator");
const catchAsyncErrors_1 = __importDefault(require("../middlewares/catchAsyncErrors"));
const plan_model_1 = __importDefault(require("../models/plan.model"));
exports.createPlanController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validation errors",
            errors: errors.array(),
        });
    }
    const { limit, price, name, expire } = req.body;
    const existingPlan = yield plan_model_1.default.findOne({ name });
    if (existingPlan) {
        return res.json({
            success: false,
            duplicate: true,
            message: "Plan name already in use",
            data: null,
        });
    }
    const plan = yield plan_model_1.default.create({
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
}));
exports.getPlansController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const plans = yield plan_model_1.default.find();
    return res.json({
        success: true,
        message: "Plans fetched successfully",
        data: plans,
    });
}));
exports.updatePlanController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { planId } = req.params;
    const { limit, price, name, expire } = req.body;
    const updatedPlan = yield plan_model_1.default.findByIdAndUpdate(planId, { limit, price, name, expire }, { new: true });
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
}));
exports.deletePlanController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { planId } = req.params;
    const deletedPlan = yield plan_model_1.default.findByIdAndDelete(planId);
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
}));
