import express from "express";
import adminRouter from "./admin.user/admin.user.router";
import projectRouter from "./project/project.router";
import userRouter from "./user/user.router";

const router = express.Router();

router.use(express.json({limit: "1mb", type: "application/json"}));

router.use("/user", userRouter);
router.use("/admin", adminRouter);
router.use("/project", projectRouter);

export default router;
