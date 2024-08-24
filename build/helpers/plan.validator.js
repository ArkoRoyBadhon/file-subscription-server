"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePlan = void 0;
const express_validator_1 = require("express-validator");
exports.validatePlan = [
    (0, express_validator_1.check)("limit").isInt({ min: 1 }).withMessage("Limit must be a positive integer"),
    (0, express_validator_1.check)("price").isFloat({ min: 0 }).withMessage("Price must be a positive number"),
    (0, express_validator_1.check)("name").notEmpty().withMessage("Name is required"),
    (0, express_validator_1.check)("expire").optional().isInt({ min: 0 }).withMessage("Expire must be a positive integer or omitted"),
];
