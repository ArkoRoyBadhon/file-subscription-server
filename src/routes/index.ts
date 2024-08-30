import express from "express";
import userRoute from "./user.route";
import subscribeRoute from "./subscription.route";
import productRoute from "./product.route";
import categoryRoute from "./category.route";
import tagRoute from "./tag.route";
import userDownloadRoutes from "./download.route";
import purchaseStatusRoutes from "./purchaseStatus.route";

const router = express.Router();

const moduleRoute = [
  {
    path: "/user",
    route: userRoute,
  },
  {
    path: "/subs",
    route: subscribeRoute,
  },
  {
    path: "/product",
    route: productRoute,
  },
  {
    path: "/category",
    route: categoryRoute,
  },
  {
    path: "/tag",
    route: tagRoute,
  },
  {
    path: "/download",
    route: userDownloadRoutes,
  },
  {
    path: "/status",
    route: purchaseStatusRoutes,
  },
];

moduleRoute.forEach((route) => router.use(route.path, route.route));

export default router;
