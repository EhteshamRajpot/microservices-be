import express from "express";
import jwt from "jsonwebtoken";
import { currentUser } from "@devnexus_microservices/common";

const router = express.Router();

router.get("/api/users/currentUser", currentUser as any, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
