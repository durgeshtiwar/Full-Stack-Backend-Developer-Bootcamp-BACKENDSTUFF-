import { Router } from "express";
import {
  accountDetailsUpdate, 
  changeCurrentPassword, 
  getCurrentUser, 
  getUserProfile, 
  getWatchHistory, 
  loginUser, 
  logOutUser, 
  refreshAccessToken, 
  registerUser, 
  updateAvatarImage, 
  updateCoverImage
} from "../controllers/user.controller.js";
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
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-account").patch(verifyJWT, accountDetailsUpdate)
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateAvatarImage)
router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateCoverImage)
router.route("/c/:username").get(verifyJWT, getUserProfile)
router.route("/history").get(verifyJWT, getWatchHistory)


export default router;