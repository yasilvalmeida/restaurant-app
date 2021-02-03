import * as mongoose from "mongoose";
import { Request, Response } from "express";
import { ISettingDocument, ISettingModel, SettingSchema } from "../models/setting";
import { StatusCode } from "../common/model";
import config from '../common/config';
import Validation from "../validation";

const Setting = mongoose.model<ISettingDocument, ISettingModel>("Setting", SettingSchema);

// Accessing to the env varibles
require("dotenv").config();

const JWT = require("jsonwebtoken");

export class SettingController {
  // Create validations objects
  public validation: Validation = new Validation();

  // Private Setting endpoint
  // Private endpoint
  // Load settings
  public fetch(req: any, res: Response) {
    const userId = req.user._id;
    Setting.findOne({
      userUUID: userId
    },
    (err, setting) => {
      if (err) {
        res.status(StatusCode.NotFound).json({
          error: true,
          message: err,
        });
      }
      res.status(StatusCode.Success).json({
        setting,
      });
    });
  }
  // Update settings
  public async update(req, res: Response) {
    let userId = req.user._id;
    let general = {
      name       : req.body.general.name,
      title      : req.body.general.title,
      version    : req.body.general.version,
      description: req.body.general.description
    };
    let device = {
      name       : req.body.device.name,
      description: req.body.device.description,
    }; 
    let foundSetting = await Setting.findOne({ 
      userUUID: userId
    });
    if (foundSetting) {
      Setting.updateOne(
      {
        _id: foundSetting._id,
      },
      {
        general,
        device
      },
      (err, result) => {
        if (err) {
          res.status(StatusCode.NotFound).json({
            error: true,
            message: err,
          });
        }
        res.status(StatusCode.Success).json({
          ok: true,
          setting: {
            general,
            device,
            userUUID: userId
          }
        });
      });
    }
    else {
      let newSetting = new Setting({
        general,
        device,
        userUUID: userId
      });
      newSetting.save((err, setting) => {
        if (err) {
          res.status(StatusCode.NotFound).json({
            error: true,
            message: err,
          });
        }
        res.status(StatusCode.Success).json({
          ok: true,
          setting: {
            general,
            device,
            userUUID: userId
          }
        });
      });
    }
  }
}
