import { Request, Response } from "express";
import { StatusCode } from "../common/model";
import { UserController } from "../controllers/user";
import Mail from "../common/mail";

// Public Routes all call the api endpoint without authentication
export class PublicRoutes {
  // Controllers that will be used in public routes endpoints
  public userController: UserController = new UserController();

  // All routes available in public routes
  public routes(app): void {
    // Base route /
    app.route("/").get((req: Request, res: Response) => {
      // processing the request requires some work!
      res.status(StatusCode.Success).json({
        EndPoint: "Public Endpoint Working",
      });
    });

    // User login
    app.route("/login")
      .post(this.userController.login);

    // User register
    app.route("/register")
      .post(this.userController.register);

    // User forgot password
    app.route("/forgot-password")
      .post(this.userController.forgotPassword);

    // User verify email
    app.route("/verify-email/:token")
      .get(this.userController.verifyEmail);

    // User reset password
    app.route("/reset-password/:token")
      .post(this.userController.validateResetPassword);

    // User google sign up or sign in 
    app.route("/google-sign").post(this.userController.OAuthToken);

  }
}
