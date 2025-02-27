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
        origin: true // Qlquer aplicação pode acessar o back-end
        // em ambiente dev = true. Em prod é so adicionar os domínios Ex: google.com
    })

    // Em produção isso precisa ser uma variável ambiente
    await fastify.register(jwt, {
        secret: 'b'
    })

    // http://localhost:3333

    // Utilizar Interfaces de API pra testar. (Ex: Postman, insomnia, hoppscotch)
    // Importar Rotas
    await fastify.register(authRoutes)
    await fastify.register(userRoutes)
    await fastify.register(cartRoutes)
    
    await fastify.listen({ port: process.env.PORT || 3333, host: '0.0.0.0' })
}

bootstrap()