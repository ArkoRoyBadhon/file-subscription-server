import { check } from "express-validator";

export const validatePlan = [
    check("limit").isInt({ min: 1 }).withMessage("Limit must be a positive integer"),
    check("price").isFloat({ min: 0 }).withMessage("Price must be a positive number"),
    check("name").notEmpty().withMessage("Name is required"),
    check("expire").optional().isInt({ min: 0 }).withMessage("Expire must be a positive integer or omitted"),
  ];