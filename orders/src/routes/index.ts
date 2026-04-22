import express, { type Request, type Response } from "express";

const router = express.Router();

router.get("/api/orders/", async (req: Request, res: Response) => {
  res.send({});
});

export { router as indexOrderRouter };