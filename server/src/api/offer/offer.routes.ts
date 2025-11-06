import { FastifyInstance } from "fastify";
import { authMiddleware } from "@/middleware/auth.middleware";
import * as OfferController from "./offer.controller";

export default async function offerRoutes(fastify: FastifyInstance) {
  /**
   * Get all offers with filters and pagination
   * @route GET /offers
   */
  fastify.get(
    "/",
    { preHandler: [authMiddleware] },
    OfferController.fetchOffers,
  );

  /**
   * Get offer by ID
   * @route GET /offers/:id
   */
  fastify.get(
    "/:id",
    { preHandler: [authMiddleware] },
    OfferController.getOfferById,
  );

  /**
   * Create new offer
   * @route POST /offers
   */
  fastify.post(
    "/",
    { preHandler: [authMiddleware] },
    OfferController.createOffer,
  );

  /**
   * Update offer
   * @route PUT /offers/:id
   */
  fastify.put(
    "/:id",
    { preHandler: [authMiddleware] },
    OfferController.updateOffer,
  );

  /**
   * Patch offer
   * @route PATCH /offers/:id
   */
  fastify.patch(
    "/:id",
    { preHandler: [authMiddleware] },
    OfferController.patchOffer,
  );

  /**
   * Delete offer (archive)
   * @route DELETE /offers/:id
   */
  fastify.delete(
    "/:id",
    { preHandler: [authMiddleware] },
    OfferController.deleteOffer,
  );
}
