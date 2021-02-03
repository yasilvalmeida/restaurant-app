import * as mongoose from "mongoose";
import { Request, Response } from "express";
import { IUserDocument, IUserModel, UserSchema } from "../models/user";
import { StatusCode } from "../common/model";
import config from '../common/config';
import Validation from "../validation";
import { sendPasswordResetEmail, sendVerificationEmail } from "../common/service";

const User = mongoose.model<IUserDocument, IUserModel>("User", UserSchema);

// Accessing to the env varibles
require("dotenv").config();

const JWT = require("jsonwebtoken");

export class UserController {
  // Create validations objects
  public validation: Validation = new Validation();

  // Private User endpoint
  // Get OAuth Token after login
  public OAuthToken(req: any, res: Response) {
    try {
      const user = req.user;
      if (!user.isVerified) {
        res.status(StatusCode.Forbidden).json({ 
          "ok": false,
          message: "verifyEmail" 
        })
      }
      //console.log(user);
      if (!user.isActive) {
        res.status(StatusCode.Forbidden).json({ 
          "ok": false,
          message: "accountDesactivated" 
        })
      }
      const token = JWT.sign(
        {
          userId: user._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d", // The student token will expire in 1 day
        }
      );
      res.status(StatusCode.Success).json({
        ok: true,
        token,
        user: {
          _id     : user._id,
          fullname: user.fullname,
          email   : user.email,
          role    : user.role,
          avatar  : user.avatar,
        }
      });
    } catch (error) {
      
    }
  }

  // Register
  public async register(req: Request, res: Response) {
    try {
      let validUser = new Validation().userRegisterValidation(req.body);
      if (validUser.error) {
        res.status(StatusCode.BadRequest).json(validUser);
      }
      else {
        let email = req.body.email;
        let foundUser = await User.findOne({ email });
        if (foundUser) 
          res.status(StatusCode.Forbidden).json({ 
            "ok": false,
            message: "emailAlreadyInUse" 
          });
        else {
          const { email, password, fullname, avatar } = req.body;
          let newUser = new User({
            email,
            fullname,
            password,
            verificationToken: config.randomTokenString(20)
          });
          await newUser.save();

          let result = await sendVerificationEmail(newUser);
          res.status(StatusCode.Success).json({ 
            "ok": true,
            "user": newUser
          });
        }
      }
    } catch (error) {
      
    }
  }
  
  // Verify E-mail
  public async verifyEmail (req: Request, res: Response) {
    try {
      // Set the token
      let token = req.params.token;
      let validToken = new Validation().userTokenValidation(req.params);
      if (validToken.error) 
          res.status(StatusCode.BadRequest).json(validToken);
      
      // Get if exist this token was generated in the user schema
      let foundUser = await User.findOne({ verificationToken: token });
      if (!foundUser) {
          res.status(StatusCode.Forbidden).json({ 
            ok: false,
            message: "verifyToken" 
          })
      }
      foundUser.verificationToken = undefined;
      foundUser.isVerified = true;
      foundUser.verified = new Date();

      await foundUser.save();

      res.status(StatusCode.Success).json({ 
        "ok": true,
        user: foundUser 
      });
    } catch (error) {
      
    }
  }

  // Forgot Password 
  public async forgotPassword(req: Request, res: Response) {
    try {
      let validToken = new Validation().userForgotPasswordValidation(req.body);
      if (validToken.error) 
        res.status(StatusCode.BadRequest).json(validToken);
      
      let { email } = req.body;

      // Get if exist this email in the user schema
      let foundUser = await User.findOne({ email });
      if (!foundUser) {
          res.status(StatusCode.Forbidden).json({ 
            ok: false,
            message: "emailNotFound" 
          })
      }

      foundUser.passwordResetToken   = config.randomTokenString(20) + "";

      // Expiration 1 day
      foundUser.passwordResetExpires = new Date(Date.now() + 24*60*60*1000)

      await foundUser.save();

      let result = await sendPasswordResetEmail(foundUser);
      res.status(StatusCode.Success).json({ 
        "ok": true,
        "user": foundUser
      });
    } catch (error) {
      
    }
}

  // Validate Reset Password
  public async validateResetPassword (req: Request, res: Response) {
    try {
      // Set the token
      let token = req.params.token;
      let { password } = req.body;
      let validToken = new Validation().userTokenValidation(req.params);
      if (validToken.error) 
        res.status(StatusCode.BadRequest).json(validToken);

      let validPassword = new Validation().userPasswordValidation(req.body);
      if (validPassword.error) 
        res.status(StatusCode.BadRequest).json(validPassword);
      
      // Set the today date
      let todayDate  = new Date(Date.now());
      // Get if exist this token was generated in the user schema
      let foundUser = await User.findOne({ 
        passwordResetToken: token
      });

      if (!foundUser) {
        res.status(StatusCode.Forbidden).json({ 
          "ok": false,
          message: "invalidToken" 
        })
      }
      if (todayDate > foundUser.passwordResetExpires) {
        res.status(StatusCode.Forbidden).json({ 
          "ok": false,
          message: "expiredToken" 
        })
      }
      
      foundUser.password = password;
      foundUser.passwordResetToken = undefined;
      foundUser.passwordResetExpires = null;

      await foundUser.save();

      res.status(StatusCode.Success).json({ 
        "ok": true,
        user: foundUser 
      });
    } catch (error) {
      
    }
  }

  // Login
  public async login (req: Request, res: Response) {
    try {
      let validUser = new Validation().userLoginValidation(req.body);
      if (validUser.error) 
          res.status(StatusCode.BadRequest).json(validUser);
      
      // Get the existent user
      // Set the user email
      let { email, password } = req.body;
      // Get if exist this email in the mongodb
      let foundUser = await User.findOne({ email });
      if (!foundUser) {
          res.status(StatusCode.Forbidden).json({ 
            "ok": false,
            message: "emailNotFound" 
          })
      }
      let match = await foundUser.isValidPassword(password);
      if (!match) {
          res.status(StatusCode.Forbidden).json({ 
            "ok": false,
            message: "wrongPassword" 
          })
      }

      if (!foundUser.isVerified) {
        res.status(StatusCode.Forbidden).json({ 
          "ok": false,
          message: "verifyEmail" 
        })
      }
      
      if (!foundUser.isActive) {
        res.status(StatusCode.Forbidden).json({ 
          "ok": false,
          message: "accountDesactivated" 
        })
      }

      // Create a json web token and send to the frontend
      let token = JWT.sign({
          iss: 'Restaurant-Api',
          sub: foundUser.id,
          iat: new Date().getTime(),
          exp: new Date().setDate(new Date().getDate() + 1)
      }, process.env.JWT_SECRET);
      //console.log("user", foundUser)
      res.status(StatusCode.Success).json({ 
        "ok": true,
        token,
        user: {
          _id     : foundUser._id,
          fullname: foundUser.fullname,
          email   : foundUser.email,
          role    : foundUser.role,
          avatar  : foundUser.avatar
        }
      });
    } catch (error) {
      //console.log(error)
    }
  }

  // Private endpoint
  // Load profile
  public loadProfile(req, res: Response) {
    const profile = req.user;
    //console.log(profile);
    res.status(StatusCode.Success).json({
      profile,
    });
  }
  // Update profile
  public async updateProfile(req, res: Response) {
    const { _id } = req.user;
    const { fullname, email, password, role } = req.body;
    if (req.files != null) {
      // Has new avatar picture
      const avatar = req.files.file.data;
      User.updateOne(
      {
        _id,
      },
      {
        fullname,
        password,
        avatar,
        updated: new Date(Date.now())
      },
      (err, result) => {
        if (err) {
          res.status(StatusCode.NotFound).json({
            error: "User profile not found for this id",
            message: err,
          });
        }
        res.status(StatusCode.Success).json({
          ok: true,
          profile: {
            fullname, 
            email,
            role, 
            avatar
          }
        });
      });
    }
    else {
      let foundUser = await User.findOne({ email });
      User.updateOne(
      {
        _id,
      },
      {
        fullname,
        password,
        updated: new Date(Date.now())
      },
      (err, result) => {
        if (err) {
          res.status(StatusCode.NotFound).json({
            error: "User profile not found for this id",
            message: err,
          });
        }
        res.status(StatusCode.Success).json({
          ok: true,
          profile: {
            fullname, 
            email,
            role, 
            avatar: foundUser.avatar
          }
        });
      });
    }
  }

  // Private user endpoint
  // Get all user
  public fetchAllByFilter(req: Request, res: Response) {
    const { filterBy, pageIndex, pageSize } = req.params;
    const pipeline = [
      {
        "$match": {
            'role': filterBy === "unassigned" ? '' : filterBy
          }
      },
      {
        "$skip": Number(pageIndex) 
      },
      {
        "$limit": Number(pageSize)  
      }
    ];
    User.aggregate(pipeline).exec().then(users => {
      res.status(StatusCode.Success).json({
        users,
      });
    });
  }
  // Insert user
  public async insert(req: Request, res: Response) {
    console.log(req.body)
    try {
      const { email, fullname, password, role } = req.body;
      User.findOne({
        email
      },
      (err, found) => {
        if (err) {
          res.status(StatusCode.InternalServerError).json({
            ok: false,
            message: err
          })
        }
        if (found) {
          res.status(StatusCode.Forbidden).json({
            ok: false,
            message: "emailAlreadyInUse"
          })
        }
        else {
          const newUser = new User({
            email,
            fullname,
            password,
            role,
            isActive: true,
            isVerified: true,
            verified: new Date(Date.now()),
          });
          newUser.save((err, user) => {
            if (err) {
              res.status(StatusCode.InternalServerError).json({
                ok: false,
                message: err
              })
            }
            res.status(StatusCode.Success).json({
              ok: true,
              user
            })
          })
        }
      });
    } catch (err) {
      res.status(StatusCode.Unauthorized).json({
        err,
      });
    }
  }
  // Update user
  public async update(req, res: Response) {
    try {
      const { id } = req.params;
      const { fullname, email, password, role, isActive, isVerified, acceptTerms } = req.body;
      if (req.files != null) {
        // Has new avatar picture
        const avatar = req.files.file.data;
        User.updateOne(
        {
          _id: id,
        },
        {
          fullname,
          password,
          role,
          isActive, 
          isVerified, 
          acceptTerms,
          avatar,
          updated: new Date(Date.now())
        },
        (err, result) => {
          if (err) {
            res.status(StatusCode.NotFound).json({
              error: "User not found for this id",
              message: err,
            });
          }
          res.status(StatusCode.Success).json({
            ok: true,
            result
          });
        });
      }
      else {
        let foundUser = await User.findOne({ email });
        User.updateOne(
          {
            _id: id,
          },
          {
            fullname,
            password,
            role,
            isActive,
            isVerified,
            acceptTerms,
            updated: new Date(Date.now()),
          },
          (err, result) => {
            if (err) {
              res.status(StatusCode.NotFound).json({
                error: "User not found for this id",
                message: err,
              });
            }
            res.status(StatusCode.Success).json({
              ok: true,
              result,
            });
          }
        );
      }
    } catch (err) {
      res.status(StatusCode.Unauthorized).json({
        err,
      });
    }
  }

  // Delete (De-register) a account
  public delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      User.findOne({
          _id: id,
        },
        (err, user) => {
          if (err) {
            res.status(StatusCode.NotFound).json({
              error: "User not found for this id",
              message: err,
            });
          }
          if (user) {
            User.findOneAndUpdate({
              _id: id
            },
            { isActive: !user.isActive },
            (err, user) => {
              if (err) {
                res.status(StatusCode.NotFound).json({
                  error: "User not found for this id",
                  message: err,
                });
              }
              res.status(StatusCode.Success).json({
                "ok": true
              });
            });
          }
        }
      );
    } catch (err) {
      res.status(StatusCode.InternalServerError).json({
        err,
      });
    }
  }

  // Create a verification
  public async createVerification(req: Request, res: Response) {
    try {
      let validUser = new Validation().userRegisterValidation(req.body);
      if (validUser.error) {
        res.status(StatusCode.BadRequest).json(validUser);
      }
      else {
        let email = req.body.email;
        let foundUser = await User.findOne({ email });
        if (!foundUser) 
          res.status(StatusCode.NotFound).json({ 
            "ok": false,
            message: "emailNotFound" 
          });
        else {
          foundUser.verificationToken = config.randomTokenString(20);
          foundUser.isVerified = false;
          foundUser.verified = null;

          await foundUser.save();

          let result = await sendVerificationEmail(foundUser);
          res.status(StatusCode.Success).json({ 
            "ok": true,
            "user": foundUser
          });
        }
      }
    } catch (error) {
      
    }
  }
}
