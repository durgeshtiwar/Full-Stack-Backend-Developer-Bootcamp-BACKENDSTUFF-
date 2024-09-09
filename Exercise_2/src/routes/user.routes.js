import { Router } from "express";
import {loginUser, logOutUser, registerUser} from "../controllers/user.controller.js";
import { upload } from "../midlewares/multer.midleware.js";
import { verifyJWT } from "../midlewares/auth.middleware.js";

const router = Router();
router.route("/register").post(
  upload.fields([
    {
      name : "avatar",
      maxCount : 1
    },
    {
      name : "coverImage",
      maxCount : 1
    }
  ]),
  registerUser);

router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT, logOutUser)


export default router;