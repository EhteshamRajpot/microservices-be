import express, { type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import { body } from "express-validator";
import { User } from "../models/user.js";
import { BadRequestError } from "@devnexus_microservices/common";
import { validateRequest } from "@devnexus_microservices/common";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters."),
  ],
  validateRequest as any,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    console.log("sign up route called", { email, password });
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // return res.send({message: "Email in use"});
      throw new BadRequestError("Email in use");
    }
    const user = User.build({ email, password });
    await user.save();

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    // Store it on session object
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
