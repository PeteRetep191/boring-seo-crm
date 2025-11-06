import { FastifyInstance } from "fastify";
// authMiddleware
import { authMiddleware } from "@/middleware/auth.middleware";

// TODO import controller here

export const websiteRoutes = async (fastify: FastifyInstance) => {
  // fetch websites
  fastify.get(
    "/",
    {
      preHandler: authMiddleware,
    },
    async (request, reply) => {
      reply.send({ message: "Hello World!" });
    },
  );

  // fetch website by id
  fastify.get(
    "/:id",
    {
      preHandler: authMiddleware,
    },
    async (request, reply) => {
      reply.send({ message: "Hello World!" });
    },
  );

  // create website
  fastify.post(
    "/",
    {
      preHandler: authMiddleware,
    },
    async (request, reply) => {
      reply.send({ message: "Hello World!" });
    },
  );

  // update website
  fastify.put(
    "/:id",
    {
      preHandler: authMiddleware,
    },
    async (request, reply) => {
      reply.send({ message: "Hello World!" });
    },
  );

  // delete website
  fastify.delete(
    "/:id",
    {
      preHandler: authMiddleware,
    },
    async (request, reply) => {
      reply.send({ message: "Hello World!" });
    },
  );
};
