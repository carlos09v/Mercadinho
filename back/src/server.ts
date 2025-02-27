import Fastify from "fastify";
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'

import { userRoutes } from './routes/user'
import { authRoutes } from './routes/auth'
import { cartRoutes } from './routes/cart'

// Criar o server
async function bootstrap() {
    const fastify = Fastify({
        logger: true // Log dos erros, alertas
    })

    await fastify.register(cors, {
        origin: process.env.CORS_ORIGIN || '*', // Utiliza a variável de ambiente ou um fallback (ex: '*')
        credentials: true,
        methods: ['POST', 'PUT', 'GET', 'DELETE']  // Métodos permitidos
    })

    await fastify.register(jwt, {
        secret: process.env.JWT_SECRET_KEY!
    });

    // http://localhost:3333

    // Utilizar Interfaces de API pra testar. (Ex: Postman, insomnia, hoppscotch)
    // Importar Rotas
    await fastify.register(authRoutes)
    await fastify.register(userRoutes)
    await fastify.register(cartRoutes)
    
    await fastify.listen({ port: process.env.SERVER_PORT || 3333, host: '0.0.0.0' })
}

bootstrap()