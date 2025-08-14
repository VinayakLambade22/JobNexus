import { Router } from "express";
import {
  register,
  login,
  uploadProfilePicture,
  updateUserProfile,
  getUserAndProfile,
  updateProfileData,
  getAllUserProfile,
  downloadProfile,
  sendConnectionRequest,
  getMyConnectionsRequests,
  whatAreMyConnections,
  acceptConnectionRequest,
  getUserProfileAndUserBaseOnUsername,
  getMyNetwork,
  rejectConnectionRequest,
  disconnectConnection,
} from "../controllers/user.controller.js";
import upload from "../config/multer.js";

const router = Router();

router
  .route("/update_profile_picture")
  .post(upload.single("profile_picture"), uploadProfilePicture);

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/user_update").post(updateUserProfile);
router.route("/get_user_and_profile").get(getUserAndProfile);
router.route("/update_profile_data").post(updateProfileData);
router.route("/user/get_all_users").get(getAllUserProfile);
router.route("/user/download_resume").get(downloadProfile);
router.route("/user/send_connection_request").post(sendConnectionRequest);
router.route("/user/get_connection_requests").get(getMyConnectionsRequests);
router.route("/user/user_connection_requests").get(whatAreMyConnections);
router.route("/user/accept_connection_request").post(acceptConnectionRequest);
router.route("/user/disconnect_connection").post(disconnectConnection);
router.route("/user/my_network").get(getMyNetwork);
router.route("/user/reject_connection_request").post(rejectConnectionRequest);
router
  .route("/user/get_profile_based_on_username")
  .get(getUserProfileAndUserBaseOnUsername);

export default router;
