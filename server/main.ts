import Fastify from 'fastify'

const fastify = Fastify({ logger: true })

fastify.get('/', async () => {
  return { hello: 'world' }
})

// Пример типизированного маршрута
fastify.get<{
  Params: { id: string }
  Querystring: { q?: string }
}>('/user/:id', async (req) => {
  const { id } = req.params
  const { q } = req.query
  return { id, q: q ?? null }
})

const PORT = Number(process.env.PORT) || 3000
const HOST = process.env.HOST || '0.0.0.0'

const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: HOST })
    console.log(`Server running on http://${HOST}:${PORT}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()