import express from "express";

const router = express.Router();

router.post("/api/users/signout", (req, res) => {
  req.session = { jwt: undefined as any };
  res.send({ message: "Signed out" });
});

export { router as signoutRouter };
