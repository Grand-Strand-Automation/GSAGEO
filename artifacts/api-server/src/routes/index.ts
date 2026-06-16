import { Router, type IRouter } from "express";
import healthRouter from "./health";
import contactRouter from "./contact";
import costAnalysisRouter from "./cost-analysis";
import geoRouter from "./geo";
import geoAdminRouter from "./geo-admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(contactRouter);
router.use(costAnalysisRouter);
router.use(geoRouter);
router.use(geoAdminRouter);

export default router;
