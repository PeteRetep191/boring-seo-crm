import { Types } from "mongoose";
import OfferModel, { IOfferDocument } from "@/models/offer.model";
import * as OfferDTOs from "./dtos";
import { buildFiltersMatch } from "@/shared/utils/mongo";

type OfferUpsert = Partial<
  Pick<
    OfferDTOs.OfferDTO,
    | "name"
    | "logoUrl"
    | "bonus"
    | "description"
    | "rating"
    | "partnerUrl"
    | "brandAdvantages"
    | "archived"
  >
>;

export const fetchOffers = async (
  opts: OfferDTOs.FetchOffersDTO,
): Promise<{
  offers: IOfferDocument[];
  total: number;
  pagination: { page: number; limit: number; pages: number; total: number };
}> => {
  const { search, page, limit } = opts;

  const searchRx = search?.trim() ? new RegExp(search.trim(), "i") : null;
  const and: any[] = [{ archived: { $ne: true } }];
  if (searchRx)
    and.push({
      $or: [{ name: searchRx }, { description: searchRx }, { bonus: searchRx }],
    });

  const filtersMatch = buildFiltersMatch?.(opts.filters);
  if (filtersMatch) and.push(filtersMatch);

  const pipeline: any[] = [];
  if (and.length) pipeline.push({ $match: { $and: and } });

  pipeline.push(
    { $sort: { createdAt: -1 } },
    {
      $facet: {
        results: [{ $skip: (page - 1) * limit }, { $limit: limit }],
        total: [{ $count: "count" }],
      },
    },
  );

  const agg = await OfferModel.aggregate(pipeline);
  const facet = agg[0] || { results: [], total: [] };
  const offers = (facet.results as any[]).map((o) =>
    OfferModel.hydrate(o),
  ) as IOfferDocument[];
  const total = facet.total[0]?.count ?? 0;

  return {
    offers,
    total,
    pagination: { page, limit, pages: Math.ceil(total / limit) || 1, total },
  };
};

export const getOfferById = async (
  id: string,
): Promise<IOfferDocument | null> => {
  if (!Types.ObjectId.isValid(id)) return null;
  return OfferModel.findById(id);
};

export const upsertOffer = async (
  id: string | Types.ObjectId | undefined,
  data: OfferUpsert,
): Promise<IOfferDocument> => {
  const _id =
    id && Types.ObjectId.isValid(String(id))
      ? new Types.ObjectId(String(id))
      : new Types.ObjectId();

  const update: Record<string, any> = {};
  if (data.name !== undefined) update.name = data.name;
  if (data.logoUrl !== undefined) update.logoUrl = data.logoUrl;
  if (data.bonus !== undefined) update.bonus = data.bonus;
  if (data.description !== undefined) update.description = data.description;
  if (data.rating !== undefined) update.rating = data.rating;
  if (data.partnerUrl !== undefined) update.partnerUrl = data.partnerUrl;
  if (data.brandAdvantages !== undefined)
    update.brandAdvantages = data.brandAdvantages;
  if (data.archived !== undefined) update.archived = data.archived;

  const doc = await OfferModel.findOneAndUpdate(
    { _id },
    { $set: update },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
  );

  return doc!;
};

export const archiveOffer = async (id: string): Promise<boolean> => {
  if (!Types.ObjectId.isValid(id)) return false;
  const updated = await OfferModel.findByIdAndUpdate(
    id,
    { $set: { archived: true } },
    { new: true, runValidators: true },
  );
  return !!updated;
};
