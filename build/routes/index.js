"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const file_route_1 = __importDefault(require("./file.route"));
const user_route_1 = __importDefault(require("./user.route"));
const plan_route_1 = __importDefault(require("./plan.route"));
const router = express_1.default.Router();
const moduleRoute = [
    {
        path: "/file",
        route: file_route_1.default,
    },
    {
        path: "/user",
        route: user_route_1.default,
    },
    {
        path: "/plan",
        route: plan_route_1.default,
    },
];
moduleRoute.forEach((route) => router.use(route.path, route.route));
exports.default = router;
