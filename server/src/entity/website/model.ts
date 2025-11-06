import { Schema, Types, Document, model } from "mongoose";

export interface IWebsite {}

export interface IWebsiteDocument extends IWebsite, Document {
  _id: Types.ObjectId;
}

const websiteSchema = new Schema<IWebsiteDocument>();

// Індекси під пошук/сортування
websiteSchema.index({ name: 1 });
websiteSchema.index({ archived: 1, createdAt: -1 });

const WebsiteModel = model<IWebsiteDocument>("Website", websiteSchema);
export default WebsiteModel;
