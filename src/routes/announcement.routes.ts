import { authorizeRole, verifyToken } from "@middleware/authMiddleware";
import { Router } from "express";
import { Role } from "../../prisma/generated/enums";
import { createAnnouncement, getAnnouncementForUser } from "@controllers/index";
import { validationMiddleware } from "@middleware/validationMiddleware";
import { CreateAnnouncement } from "@dto/announcement.dto";

const routes = Router();

routes.use(verifyToken);

routes.get('/my', getAnnouncementForUser);
routes.post('/', authorizeRole([Role.ADMIN]), validationMiddleware(CreateAnnouncement), createAnnouncement);

export default routes;