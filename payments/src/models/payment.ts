import mongoose from "mongoose";

interface PaymentAttrs {
  id: string;
  orderId: string;
  stripeId: string;
}

interface PaymentDoc extends mongoose.Document, PaymentAttrs {}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc;
}

const paymentSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  stripeId: { type: String, required: true },
}, {
  toJSON: {
    transform(doc, ret: Record<string, unknown>) {
      ret.id = doc.id;
      delete ret._id;
      delete ret.__v;
    },
  },
});

paymentSchema.set("versionKey", "version");

paymentSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment({
    _id: new mongoose.Types.ObjectId().toString(),
    orderId: attrs.orderId,
    stripeId: attrs.stripeId,
  });
};

const Payment = mongoose.model<PaymentDoc, PaymentModel>("Payment", paymentSchema);

export { Payment };