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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signinController = exports.registerUserController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const catchAsyncErrors_1 = __importDefault(require("../middlewares/catchAsyncErrors"));
const user_model_1 = __importDefault(require("../models/user.model"));
const jwtToken_1 = require("../utils/jwtToken");
exports.registerUserController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, password, role } = req.body;
    console.log(req.body);
    const existingEmail = yield user_model_1.default.findOne({ email });
    if (existingEmail) {
        return res.json({
            success: true,
            duplicate: true,
            message: "email already in used",
            data: null,
        });
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    const user = yield user_model_1.default.create({
        firstName,
        lastName,
        role,
        email,
        password: hashedPassword,
    });
    const tokenPayload = {
        email: user.email,
        userId: user._id.toString(),
    };
    const accessToken = (0, jwtToken_1.createAcessToken)(tokenPayload, "7d");
    const userWithoutPassword = user.toObject();
    const { password: _ } = userWithoutPassword, userResponse = __rest(userWithoutPassword, ["password"]);
    return res.json({
        success: true,
        message: "Account created successfully",
        accessToken,
        data: userResponse,
    });
}));
exports.signinController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield user_model_1.default.findOne({ email });
    if (!user) {
        return res.json({
            success: false,
            message: "email is not registered",
            data: null,
        });
    }
    const isPasswordCorrect = yield bcrypt_1.default.compare(password, user.password);
    if (!isPasswordCorrect) {
        return res.json({
            success: false,
            message: "Invalid password",
            data: null,
        });
    }
    const tokenPayload = {
        email: user.email,
        userId: user._id.toString(),
    };
    const accessToken = (0, jwtToken_1.createAcessToken)(tokenPayload, "1h");
    const userWithoutPassword = user.toObject();
    const { password: _ } = userWithoutPassword, userResponse = __rest(userWithoutPassword, ["password"]);
    return res.json({
        success: true,
        message: "Signin success",
        data: userResponse,
        accessToken,
    });
}));
