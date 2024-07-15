import express from "express";
import fileRoute from "./file.route";
import userRoute from "./user.route";

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
];

moduleRoute.forEach((route) => router.use(route.path, route.route));

export default router;
