import mongoose from "mongoose";
import { OrderStatus } from "devnexus-microservices-common";
import { type TicketDoc } from "./ticket.js";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
  version: number;
}

interface OrderDoc extends mongoose.Document, OrderAttrs {}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(OrderStatus),
  },
  expiresAt: {
    type: Date,
  },
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ticket",
    required: true,
  },
  version: {
    type: Number,
    required: true,
  },
}, {
  versionKey: false,
  toJSON: {
    transform(doc, ret: Record<string, unknown>) {
      ret.id = doc.id;
      delete ret._id;
      delete ret.__v;
    },
  },
});

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };