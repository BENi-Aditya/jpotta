import { Router, type IRouter } from "express";
import healthRouter from "./health";
import adminRouter from "./admin";
import reviewsRouter from "./reviews";
import newsRouter from "./news";
import achievementsRouter from "./achievements";
import playersRouter from "./players";
import committeeRouter from "./committee";
import setupRouter from "./setup";

const router: IRouter = Router();

router.use(healthRouter);
router.use(adminRouter);
router.use(reviewsRouter);
router.use(newsRouter);
router.use(achievementsRouter);
router.use(playersRouter);
router.use(committeeRouter);
router.use(setupRouter);

export default router;
