import express from "express";
import fileRoute from "./file.route";
import userRoute from "./user.route";
import planRoute from "./plan.route";
import purchaseRoute from "./purchase.route";
import productRoute from "./product.route";

const router = express.Router();

const moduleRoute = [
  {
    path: "/file",
    route: fileRoute,
  },
  {
    path: "/user",
    route: userRoute,
  },
  {
    path: "/plan",
    route: planRoute,
  },
  {
    path: "/purchase",
    route: purchaseRoute,
  },
  {
    path: "/product",
    route: productRoute,
  },
];

moduleRoute.forEach((route) => router.use(route.path, route.route));

export default router;
