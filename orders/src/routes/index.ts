import express, { type Request, type Response } from "express";
import { requireAuth } from "devnexus-microservices-common";
import { Order } from "../models/order.js";

const router = express.Router();

const listOrdersForCurrentUser = async (req: Request, res: Response) => {
  const orders = await Order.find({
    userId: req.currentUser!.id,
  }).populate("ticket");
  res.send(orders);
};

// Match clients that call `/api/orders` (no trailing slash); ingress strips nothing.
router.get("/api/orders", requireAuth as any, listOrdersForCurrentUser);
router.get("/api/orders/", requireAuth as any, listOrdersForCurrentUser);

export { router as indexOrderRouter };
