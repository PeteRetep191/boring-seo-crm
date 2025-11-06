import { FastifyRequest, FastifyReply } from "fastify";
import { ApiResponse, ErrorUtils } from "@/shared/utils";
import * as OfferSchemas from "./offer.schemas";
import * as OfferService from "./offer.service";

// GET /offers
export async function fetchOffers(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const q = request.query as any;

    // совместимость с UI: filters приходит строкой
    const raw = typeof q.filters === "string" ? q.filters : undefined;
    const uiFilters = raw ? JSON.parse(decodeURIComponent(raw)) : [];

    const { filters: _ignored, ...rest } = q;
    const params = { ...rest, filters: uiFilters };

    const query = OfferSchemas.fetchOffersSchema.parse(params);

    const result = await OfferService.fetchOffers({
      search: query.search,
      page: query.page,
      limit: query.limit,
      filters: query.filters,
    });

    return ApiResponse.success(reply, result);
  } catch (error) {
    console.error("Error fetching offers:", error);
    return ApiResponse.error(reply, ErrorUtils.parseError(error), 400);
  }
}

// GET /offers/:id
export async function getOfferById(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { id } = request.params as { id: string };
    const offer = await OfferService.getOfferById(id);
    if (!offer) return ApiResponse.notFound(reply, "Offer not found");
    return ApiResponse.success(reply, offer);
  } catch (error) {
    return ApiResponse.error(reply, ErrorUtils.parseError(error), 500);
  }
}

// POST /offers  (create via upsert with new id)
export async function createOffer(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const payload = OfferSchemas.createOfferSchema.parse(request.body);
    const offer = await OfferService.upsertOffer(undefined, payload);
    reply.code(201);
    return ApiResponse.success(reply, offer);
  } catch (error) {
    return ApiResponse.error(reply, ErrorUtils.parseError(error), 500);
  }
}

// PUT /offers/:id  (update via upsert by id)
export async function updateOffer(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { id } = request.params as { id: string };
    const data = OfferSchemas.updateOfferSchema.parse(request.body);
    const offer = await OfferService.upsertOffer(id, data);
    if (!offer) return ApiResponse.notFound(reply, "Offer not found");
    return ApiResponse.success(reply, offer);
  } catch (error) {
    return ApiResponse.error(reply, ErrorUtils.parseError(error), 500);
  }
}

// PATCH /offers/:id  (update via upsert by id)
export async function patchOffer(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = request.params as { id: string };
    const data = OfferSchemas.updateOfferSchema.parse(request.body);
    const offer = await OfferService.upsertOffer(id, data);
    if (!offer) return ApiResponse.notFound(reply, "Offer not found");
    return ApiResponse.success(reply, offer);
  } catch (error) {
    return ApiResponse.error(reply, ErrorUtils.parseError(error), 500);
  }
}

// DELETE /offers/:id (archive)
export async function deleteOffer(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { id } = request.params as { id: string };
    const ok = await OfferService.archiveOffer(id);
    if (!ok) return ApiResponse.notFound(reply, "Offer not found");
    return ApiResponse.success(reply, {
      message: "Offer archived successfully",
    });
  } catch (error) {
    return ApiResponse.error(reply, ErrorUtils.parseError(error), 500);
  }
}
