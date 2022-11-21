import express from "express";
import { signup } from "../controllers/signup";
import { login } from "../controllers/login";
import getUser from "../controllers/get-user";

const accountRoutes = express.Router();

accountRoutes.post("/signup", (req, res) => {
  signup(req, res);
});

accountRoutes.post("/login", (req, res) => {
  login(req, res);
});

accountRoutes.get("/get-user", (req, res) => {
  getUser(req, res);
});

export default accountRoutes;
