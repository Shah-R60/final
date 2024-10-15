import {Router} from "express"
import {verifyJWT} from "../middlewares/aut.middlewares.js"
import {createPlaylist} from "../controllers/playlist.controller.js"
const router = Router();

router.route("/").post(verifyJWT,createPlaylist);

export default router;
