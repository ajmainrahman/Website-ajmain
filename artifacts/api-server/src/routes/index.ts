import { Router, type IRouter } from "express";
import healthRouter from "./health";
import adminRouter from "./admin";
import profileRouter from "./profile";
import certificatesRouter from "./certificates";
import researchRouter from "./research";
import projectsRouter from "./projects";
import blogpostsRouter from "./blogposts";
import hobbiesRouter from "./hobbies";
import educationRouter from "./education";
import skillsRouter from "./skills";
import campusAmbassadorsRouter from "./campus_ambassadors";
import photosRouter from "./photos";
import storiesRouter from "./stories";
import messagesRouter from "./messages";

const router: IRouter = Router();

router.use(healthRouter);
router.use(adminRouter);
router.use(messagesRouter);
router.use(profileRouter);
router.use(certificatesRouter);
router.use(researchRouter);
router.use(projectsRouter);
router.use(blogpostsRouter);
router.use(hobbiesRouter);
router.use(educationRouter);
router.use(skillsRouter);
router.use(campusAmbassadorsRouter);
router.use(photosRouter);
router.use(storiesRouter);

export default router;
