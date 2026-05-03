import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
} from "devnexus-microservices-common";
import express, { type Request, type Response } from "express";
import { Order } from "../models/order.js";
import { body } from "express-validator";
import Stripe from "../stripe.js";
import { Payment } from "../models/payment.js";
import { PaymentCreatedPublisher } from "../events/publisher/payment-created-publisher.js";
import { natsWrapper } from "../nats-wrapper.js";
import mongoose from "mongoose";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth as any,
  [
    body("orderId").not().isEmpty().withMessage("Order ID is required"),
    body("token").not().isEmpty().withMessage("Token is required"),
  ],
  async (req: Request, res: Response) => {
    const { orderId, token } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Order is cancelled");
    }
    const charge = await Stripe.charges.create({
      currency: "usd",
      amount: order.price * 100,
      source: token,
    });

    const payment = Payment.build({
      id: new mongoose.Types.ObjectId().toString(),
      orderId: orderId,
      stripeId: charge.id,
    });
    await payment.save();

    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment._id.toString(),
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    res.status(201).send({ success: true });
  }
);

export { router as newPaymentRouter };
