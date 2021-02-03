import { Document, Model, model, Types, Schema } from "mongoose";

// Schema
export const PromissionSchema: any = new Schema({
  dashboard: {
    type: Boolean,
    required: true,
  },
  order: {
    type: Boolean,
    required: true,
  },
  makeOrder: {
    type: Boolean,
    required: true,
  },
  restaurant: {
    type: Boolean,
    required: true,
  },
  review: {
    type: Boolean,
    required: true,
  },
  category: {
    type: Boolean,
    required: true,
  },
  tag: {
    type: Boolean,
    required: true,
  },
  allergis: {
    type: Boolean,
    required: true,
  },
  coupons: {
    type: Boolean,
    required: true,
  },
  users: {
    type: Boolean,
    required: true,
  },
  role: {
    type: Boolean,
    required: true,
  },
  chat: {
    type: Boolean,
    required: true,
  },
  invoice: {
    type: Boolean,
    required: true,
  },
  mainSettings: {
    type: Boolean,
    required: true,
  },
  nottificatios: {
    type: Boolean,
    required: true,
  },
  userUUID: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});
// IPromission interface
export interface IPromission {
  name: string;
  courseUUID: Types.ObjectId;
}
// Not directly exported because it is not recommanded to
// use this interface direct unless necessarys since the
// type of `Course` field is not deterministic
interface IPromissionBaseDocument extends IPromission, Document {}
// Export this for strong typing
export type IPromissionDocument = IPromissionBaseDocument;
// Export this for strong typing
export type IPromissionPopulatedDocument = IPromissionBaseDocument;
// Static methods
PromissionSchema.statics.findMyCourse = async function (id) {
  return this.findById(id).populate("Course").exec();
};
// For model
export interface IPromissionModel extends Model<IPromissionDocument> {
  findMyCourse(id: string): Promise<IPromissionPopulatedDocument>;
}
// Default export
export default model<IPromissionDocument, IPromissionModel>("Promission", PromissionSchema);
