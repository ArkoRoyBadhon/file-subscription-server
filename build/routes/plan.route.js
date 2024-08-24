"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const plan_controller_1 = require("../controllers/plan.controller");
const plan_validator_1 = require("../helpers/plan.validator");
const router = (0, express_1.Router)();
router.post("/create", plan_validator_1.validatePlan, plan_controller_1.createPlanController);
const planRoute = router;
exports.default = planRoute;
