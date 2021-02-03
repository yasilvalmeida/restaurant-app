import { Request, Response } from "express";
import { StatusCode } from "../common/model";
import { UserController } from "../controllers/user";
import { SettingController } from "../controllers/setting";
import { ChatController } from "../controllers/chat";

// Private Routes all call the api endpoint with authentication for User
export class UserRoutes {
  // Controllers that will be used in root private routes endpoints
  public userController: UserController = new UserController();

  public settingController: SettingController = new SettingController();

  public chatController: ChatController = new ChatController();

  // All routes available in private routes that must be called by User
  public routes(app): void {

    /* Begin Settings Endpoint */
    // Fetch settings
    app.route("/settings/").get(this.settingController.fetch);
    // Update settings
    app.route("/settings/").put(this.settingController.update);
    /* End Settings Endpoint */

    /* Begin User EndPoint */
    // Perform the google oauth login
    app.route("/google/token/").get(this.userController.OAuthToken);
    // Load profile
    app.route("/profile/").get(this.userController.loadProfile);
    // Update profile
    app.route("/profile/").post(this.userController.updateProfile);
    // Fetch users
    app.route("/users/:filterBy/:pageIndex/:pageSize").get(this.userController.fetchAllByFilter);
    // Update user
    app.route("/users/").post(this.userController.insert);
    // Update user
    app.route("/users/:id").put(this.userController.update);
    // Delete user
    app.route("/users/:id").delete(this.userController.delete);
    // Verify user
    app.route("/users/verify").post(this.userController.createVerification);
    // User forgot password
    app.route("/users/forgot-password")
      .post(this.userController.forgotPassword);
    /* End User EndPoint */

    /* Begin Chat EndPoint */
    // Fetch all receivers for me
    app.route("/chat/receiver").get(this.chatController.fetchAllReceiver);
    // Fetch all chats by receiver
    app.route("/chat/:receiverUUID").get(this.chatController.fetchAllChat);
    // Update chat
    app.route("/chat/:receiverUUID").post(this.chatController.insert);
    /* End Chat EndPoint */
  }
}
