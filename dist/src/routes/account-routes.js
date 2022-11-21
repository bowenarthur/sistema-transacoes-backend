"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const signup_1 = require("../controllers/signup");
const login_1 = require("../controllers/login");
const get_user_1 = __importDefault(require("../controllers/get-user"));
const accountRoutes = express_1.default.Router();
accountRoutes.post("/signup", (req, res) => {
    (0, signup_1.signup)(req, res);
});
accountRoutes.post("/login", (req, res) => {
    (0, login_1.login)(req, res);
});
accountRoutes.get("/get-user", (req, res) => {
    (0, get_user_1.default)(req, res);
});
exports.default = accountRoutes;
//# sourceMappingURL=account-routes.js.map