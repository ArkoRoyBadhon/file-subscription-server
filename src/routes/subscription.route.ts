import { Router } from "express";
import { authorizeRoles, isAuthenticatedUser } from "../middlewares/auth";
import { createCustomerPortal, createSubscription, getAllSubscriptions, getPrices, getSubscriptionStatus } from "../controllers/subscription.controller";

const router = Router();

router.get("/prices", getPrices);
router.post("/create-subscription", isAuthenticatedUser, createSubscription);
router.get("/subscription-status", isAuthenticatedUser, getSubscriptionStatus);
router.get("/subscriptions", isAuthenticatedUser, getAllSubscriptions);
router.get("/customer-portal", isAuthenticatedUser, createCustomerPortal);

const subscriptionRoute = router;
export default subscriptionRoute;
