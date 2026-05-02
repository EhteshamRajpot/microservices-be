import express, { type Request, type Response } from "express";
import { requireAuth } from "devnexus-microservices-common";
import { Order } from "../models/order.js";

const router = express.Router();

router.get(
  "/api/orders/",
  requireAuth as any,
  async (req: Request, res: Response) => {
    const orders = await Order.find({
      userId: req.currentUser!.id,
    }).populate("ticket");
    res.send(orders);
  }
);

export { router as indexOrderRouter };
