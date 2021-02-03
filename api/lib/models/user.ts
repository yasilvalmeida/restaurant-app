import { Document, Model, model, ObjectId, Schema } from "mongoose";

let bcrypt = require("bcryptjs");

export const UserSchema: any = new Schema({
  fullname: {
    type: String,
  },
  email: {
    type: String,
  },
  googleId: {
    type: String,
    default: ''
  },
  password: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ["root", "admin", "owner", "driver", ""],
    default: ""
  },
  avatar: {
    type: Buffer,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  acceptTerms: {
    type: Boolean,
    default: true
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: null,
  },
  verificationToken: {
    type: String,
  },
  verified: {
    type: Date,
    default: null,
  },
  passwordResetToken: { 
      type: String,
      default: ""
  },
  passwordResetExpires: {
    type: Date,
    default: null,
  },
});

// User interface
export interface IUser {
  fullname             : string;
  email                : string;
  avatar               : unknown;
  role                 : string;
  isActive             : boolean;
  isVerified           : boolean;
  acceptTerms          : boolean;
  googleId             : string;
  password             : string;
  created              : Date;
  updated              : Date;
  verificationToken    : string;
  verified             : Date;
  passwordResetToken   : string;
  passwordResetExpires : Date;
}
// Not directly exported because it is not recommanded to
// use this interface direct unless necessarys since the
// type of `company` field is not deterministic
interface IUserBaseDocument extends IUser, Document {
  isValidPassword(string): string;
}

// Document middlewares
UserSchema.pre("save", async function(this: IUserDocument, next) {
    try {
      if (this.password != '') {
        /* let salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(this.password, salt);
        this.password = passwordHash; */
        //console.log("this.password=", this.password);
        next();
      }
    }
    catch (error) {
        next(error);
    }
});
UserSchema.pre("update", async function(this: IUserDocument, next) {
    try {
      if (this.password != '') {
        /* let salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(this.password, salt);
        this.password = passwordHash;
        console.log("this.password=", this.password); */
        next();
      }
    }
    catch (error) {
        next(error);
    }
});

// Methods
UserSchema.methods.isValidPassword = async function (newPassword: String) {
    try {
      /* console.log(this.password)
      console.log(newPassword)
      let salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(newPassword, salt);
      console.log(passwordHash)
      let result = await bcrypt.compare(this.password, newPassword);
      console.log(result) */
      return this.password === newPassword;
    }
    catch (error) {
      throw new Error(error);
    }
}

// Export this for strong typing
export type IUserDocument = IUserBaseDocument;

// For model
export type IUserModel = Model<IUserDocument>;

export default model<IUserDocument, IUserModel>("User", UserSchema);
