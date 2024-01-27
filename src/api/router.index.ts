import express from "express";
import userRouter from "./user/user.router";

const router = express.Router();

router.use(express.json({limit: "1mb", type: "application/json"}));
router.use("/user", userRouter);

export default router;
