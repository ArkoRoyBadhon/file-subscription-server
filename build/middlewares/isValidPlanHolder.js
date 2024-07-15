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
exports.isValidPlanHolder = void 0;
const file_model_1 = __importDefault(require("../models/file.model"));
const plan_model_1 = __importDefault(require("../models/plan.model"));
const purchasedPlan_1 = __importDefault(require("../models/purchasedPlan"));
const sendResponse_1 = __importDefault(require("../utils/sendResponse"));
const catchAsyncErrors_1 = __importDefault(require("./catchAsyncErrors"));
exports.isValidPlanHolder = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const fileId = req.params.fileId;
    const file = yield file_model_1.default.findById(fileId);
    if (!file) {
        return (0, sendResponse_1.default)(res, {
            message: "file not found",
            data: null,
            success: true,
        });
    }
    if (file.isFree) {
        return next();
    }
    const purchasedPlan = yield purchasedPlan_1.default.findById(user.plan);
    if (!purchasedPlan) {
        return (0, sendResponse_1.default)(res, {
            data: null,
            message: "no plan found",
            success: false,
            statusCode: 404,
        });
    }
    const plan = yield plan_model_1.default.findById(purchasedPlan.plan);
    if (!plan) {
        return (0, sendResponse_1.default)(res, {
            data: null,
            message: "no plan found",
            success: false,
            statusCode: 404,
        });
    }
    if (!purchasedPlan.limit) {
        return (0, sendResponse_1.default)(res, {
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
        return (0, sendResponse_1.default)(res, {
            data: null,
            success: false,
            statusCode: 403,
            message: "Plan has been expired",
        });
    }
    req.purchasedPlanId = purchasedPlan._id;
    next();
}));
