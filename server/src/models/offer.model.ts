import { Schema, Types, Document, model } from "mongoose";

export interface IOffer {
  name: string;
  logoUrl?: string | null;
  bonus: string;
  description?: string | null;
  rating: number;
  partnerUrl?: string | null;
  brandAdvantages: string[];
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOfferDocument extends IOffer, Document {
  _id: Types.ObjectId;
}

const offerSchema = new Schema<IOfferDocument>(
  {
    name: { type: String, required: true, trim: true },
    logoUrl: { type: String, trim: true },
    bonus: { type: String, required: true },
    description: { type: String, trim: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    partnerUrl: { type: String, trim: true },
    brandAdvantages: { type: [String], default: [] },
    archived: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Індекси під пошук/сортування
offerSchema.index({ name: 1 });
offerSchema.index({ archived: 1, createdAt: -1 });

const OfferModel = model<IOfferDocument>("Offer", offerSchema);
export default OfferModel;