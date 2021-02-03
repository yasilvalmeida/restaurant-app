import * as mongoose from "mongoose";
import { Request, Response } from "express";
import { IChatDocument, IChatModel, ChatSchema } from "../models/chat";
import { IUserDocument, IUserModel, UserSchema } from "../models/user";
import { StatusCode } from "../common/model";

const Chat = mongoose.model<IChatDocument, IChatModel>("Chat", ChatSchema);
const User = mongoose.model<IUserDocument, IUserModel>("User", UserSchema);

export class ChatController {

  // Private Chat endpoint
  // Get all Receivers
  public fetchAllReceiver(req, res: Response) {
    const { _id, role } = req.user;
    if (role == 'root') {
      User.find({
        role: { $ne: role }
      },
      (err, ctxs) => {
        var contacts = [];
        ctxs.map((ctx: any, i) => {
          contacts[i] = {
            "_id": ctx._id,
            "fullname": ctx.fullname,
            "email": ctx.email,
            "role": ctx.role,
            "avatar": ctx.avatar,
            "status": 'online'
          }
        })
        res.status(StatusCode.Success).json({
          contacts
        })
      });
    }
  }
  // Get all Chat
  public fetchAllChat(req, res: Response) {
    const { _id, role } = req.user;
    const { receiverUUID } = req.params;
    let pipeline = [];
    if (role == 'root') {
      // Get all chats to normal user
      pipeline = [
        {
          $match: {
            $and: [
              {
                senderUUID: mongoose.Types.ObjectId(_id),
              },
              {
                receiverUUID: mongoose.Types.ObjectId(receiverUUID),
              },
            ],
          },
        },
      ];
    }
    else {
      // Get all chat to root
      User.findOne({
        _id: receiverUUID,
        role: 'root'
      },
      (err, foundUser) => {
        pipeline = [
          {
            $match: {
              $and: [
                {
                  senderUUID: mongoose.Types.ObjectId(_id),
                },
                {
                  receiverUUID: mongoose.Types.ObjectId(receiverUUID),
                },
              ],
            },
          },
        ];
      });
    }
    Chat.aggregate(pipeline).exec().then(dialogs => {
      res.status(StatusCode.Success).json({
        dialogs
      });
    });
  }
  // Insert Chat
  public async insert(req, res: Response) {
    try {
      const { user } = req;
      const { message, receiverUUID } = req.body;
      const newChat = new Chat({
        message,
        sernderUUID: user._id,
        receiverUUID,
      });
      newChat.save((err, Chat) => {
        if (err) {
          res.status(StatusCode.InternalServerError).json({
            ok: false,
            message: err
          })
        }
        res.status(StatusCode.Success).json({
          ok: true,
          Chat
        })
      })
    } catch (err) {
      res.status(StatusCode.Unauthorized).json({
        err,
      });
    }
  }
}
