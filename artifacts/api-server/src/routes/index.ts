import { Router, type IRouter } from "express";
import healthRouter from "./health";
import contactRouter from "./contact";
import costAnalysisRouter from "./cost-analysis";

const router: IRouter = Router();

router.use(healthRouter);
router.use(contactRouter);
router.use(costAnalysisRouter);

export default router;
