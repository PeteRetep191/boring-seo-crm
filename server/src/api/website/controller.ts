import { FastifyRequest, FastifyReply } from "fastify";
// DTOs
// Services

// GET /website
export const fetch = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const result = [] as any[];
    reply.send(result);
  } catch (error) {
    reply.status(500).send(error);
  }
};

// GET /website/:id
export const fetchById = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const result = {};
    reply.send(result);
  } catch (error) {
    reply.status(500).send(error);
  }
};

// POST /website/:id
export const create = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const result = {};
    reply.send(result);
  } catch (error) {
    reply.status(500).send(error);
  }
};

// PUT /website/:id
export const update = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const result = {}; // returns updated website
    reply.send(result);
  } catch (error) {
    reply.status(500).send(error);
  }
};

// DELETE /website/:id
export const remove = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const result = {}; // returns deleted website
    reply.send(result);
  } catch (error) {
    reply.status(500).send(error);
  }
};
