import express from "express";
import fileRoute from "./file.route";
import userRoute from "./user.route";
import planRoute from "./plan.route";

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
];

moduleRoute.forEach((route) => router.use(route.path, route.route));

export default router;
