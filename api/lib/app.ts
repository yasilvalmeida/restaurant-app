import * as express from "express";
import * as bodyParser from "body-parser";
import { UserRoutes } from "./routes/user";
import { PublicRoutes } from "./routes/public";
import { UserSchema } from "./models/user";
import * as mongoose from "mongoose";
import Environment from "./environment";
import { StatusCode } from "./common/model";
import config from "./common/config";
import { sendVerificationEmail } from "./common/service";

const cors = require("cors");
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
//const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { ExtractJwt } = require("passport-jwt");
const toobusy = require("toobusy-js");

var request = require('request');
var fs = require('fs');

// Accessing to the env varibles
require("dotenv").config();

const { OAuth2Client } = require('google-auth-library');
const GOOGLEID = process.env.CLIENT_ID;
const client = new OAuth2Client(GOOGLEID);

const os = require("os");

const swaggerUi = require("swagger-ui-express"),
  swaggerDocument = require("../swagger.json");

export default class App {
  // Express App
  public app: express.Application;

  private fileUpload = require("express-fileupload");

  // Routes
  private userRoutes: UserRoutes = new UserRoutes();

  private publicRoutes: PublicRoutes = new PublicRoutes();

  // Mongo DB url connection string
  private mongoUrl: string;

  // Constructor
  constructor(envParameters: Environment) {
    // Express App Creation
    this.app = express();
    //this.router = express.Router();
    // Express Configuration
    this.config();
    // Config Swagger API Documentation
    this.swagger();
    // Too Busy Configuration
    this.tooBusy();
    // Passport and strategies
    this.passport();
    // MongoDB Configuration
    this.mongoSetup(envParameters);
    // All API EndPoint Routes
    this.userRoutes.routes(this.app);
    this.publicRoutes.routes(this.app);
  }

  // Basic configurations
  private config(): void {
    // Allow CORS
    this.app.use(cors());
    // Support application/json type post data
    this.app.use(bodyParser.json());
    // Support application/x-www-form-urlencoded post data
    this.app.use(bodyParser.urlencoded({ extended: true }));
    //  Support multy part form data or files
    this.app.use(this.fileUpload());
  }

  private tooBusy(): void {
    // Set maximum lag to an aggressive value.
    toobusy.maxLag(1000);

    // Set check interval to a faster value. This will catch more latency spikes
    // but may cause the check to be too sensitive.
    toobusy.interval(250);

    // Get current maxLag or interval setting by calling without parameters.
    //const currentMaxLag = toobusy.maxLag();
    //const interval = toobusy.interval();

    toobusy.onLag((currentLag) => {
      console.log("Event loop lag detected! Latency: " + currentLag + "ms");
    });

    // middleware which blocks requests when we're too busy
    this.app.use((req, res, next) => {
      // check if we're toobusy() - note, this call is extremely fast, and returns
      // state that is cached at a fixed interval
      if (toobusy())
        res.status(StatusCode.ServiceUnavailable).json({
          error: "Server is too busy right now",
        });
      else next();
    });
  }

  private swagger(): void {
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }

  private passport(): void {
    // Models
    const User = mongoose.model("User", UserSchema);
    // Json Web Token Strategy for User
    passport.use(
      "jwt",
      new JwtStrategy(
        {
          jwtFromRequest: ExtractJwt.fromHeader("authorization"),
          secretOrKey: process.env.JWT_SECRET,
        },
        async (payload, done) => {
          try {
            const user = await User.findById(payload.sub);
            if (!user) return done(null, false);

            done(null, user);
          } catch (error) {
            done(error, false);
          }
        }
      )
    );
    // Middleware to check for passport authentication type
    // Admin register/login
    this.app.use('/google-sign', async (req: any, res, next) => {
      const { tokenId } =  req.body;
      //console.log(tokenId)
      const ticket = await client.verifyIdToken({
        idToken: tokenId,
        audience: GOOGLEID,  // Specify the CLIENT_ID of the app that accesses the backend
      });
      const payload = ticket.getPayload();
      const googleId = payload['sub'];
      try {
        User.findOne(
          {
            googleId: googleId
          },
          (error, user: typeof UserSchema ) => {
            if (error) 
              res.status(StatusCode.InternalServerError).json({
                error,
              });
            else if (user) {
              // Return the existent admin
              req.user = user;
              next();
            } else {
              let url = payload.picture,
                options = {
                  url,
                  method: "get",
                  encoding: null
                },
                buffer: Buffer;
              //console.log('Requesting image..');
              request(options, function (error, response, body) {

                if (error) {
                  console.error('error:', error);
                } else {
                  //console.log('Response: StatusCode:', response && response.statusCode);
                  buffer = body;
                  //console.log(buffer)
                  // Return the existent user
                  // Create new user
                  const newUser = new User({
                    googleId: googleId,
                    fullname: payload.name,
                    email: payload.email,
                    avatar: buffer,
                    isVerified: true
                  });
                  newUser.save((err, user) => {
                    if (error) 
                      res.status(StatusCode.InternalServerError).json({
                        error,
                      });
                    req.user = user;
                    next();
                  });
                }
              });
            }
          }
        );
      } catch (error) {
        if (error) 
          res.status(StatusCode.InternalServerError).json({
            error,
          });
      }
    });
    // Protect User Routes using Json Web Token
    this.app.use(
      "/profile/",
      passport.authenticate("jwt", {
        session: false,
      }),
      function (req, res, next) {
        next();
      }
    );
    this.app.use(
      "/settings/",
      passport.authenticate("jwt", {
        session: false,
      }),
      function (req: any, res, next) {
        const role = req.user.role;
        if (role == "root") {
          next();
        }
        else {
          res.status(StatusCode.Unauthorized).json({
            EndPoint: "You must be a root.",
          });
        }
      }
    );
    this.app.use(
      "/users/",
      passport.authenticate("jwt", {
        session: false,
      }),
      function (req: any, res, next) {
        const role = req.user.role;
        if (role == "root") {
          next();
        }
        else {
          res.status(StatusCode.Unauthorized).json({
            EndPoint: "You must be a root.",
          });
        }
      }
    );
    this.app.use(
      "/chat/",
      passport.authenticate("jwt", {
        session: false,
      }),
      function (req: any, res, next) {
        next();
        /* const role = req.user.role;
        if (role == "root") {
          next();
        }
        else {
          res.status(StatusCode.Unauthorized).json({
            EndPoint: "You must be a root.",
          });
        } */
      }
    );
  }
  private mongoSetup(envParameters): void {
    // Create connection string
    //this.mongoUrl = `mongodb+srv://mongo_sa:${process.env.MONGO_DB_PWD}@cluster0.rgy39.mongodb.net/${envParameters.getDBName()}?retryWrites=true&w=majority`;
    this.mongoUrl = `mongodb://localhost/${envParameters.getDBName()}`;
    // Connect to the server using the connection string
    mongoose
      .connect(this.mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      })
      .then(() => {
        //console.log('MongoDB connected on dbname ' + envParameters.getDBName())
      })
      .catch((e) => console.log("MongoDB connection error", e));
  }
}
