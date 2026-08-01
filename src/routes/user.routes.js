import { Router } from "express";
import {
    registerUser,
    loginUser,
    loggedOutUser,
    refreshAccessToken,
    changePassword,
    updateAccountdetails,
    updateUserAvatar,
    updateUsercoverImage,
    getUserChannelProfile,
    getWatchHistory
} from "../controllers/user.controllers.js";

import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ])
    , registerUser
)

router.route("/login").post(loginUser)

//secure routes
router.route("/logout").post(verifyJWT, loggedOutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/update-user-detail").patch(verifyJWT,updateAccountdetails)
router.route("/change-password").post(verifyJWT,changePassword)
router.route("/update-avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar)
router.route("/update-coverImage").patch(verifyJWT,upload.single("coverImage")
,updateUsercoverImage)

router.route("/channel").get(verifyJWT,getUserChannelProfile)
router.route("/user-watchHistory").get(verifyJWT,getWatchHistory)


export default router;