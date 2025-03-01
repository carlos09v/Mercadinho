import Fastify from "fastify";
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { jsonSchemaTransform, serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";
import fastifySwagger from "@fastify/swagger";

import { userRoutes } from './routes/user'
import { authRoutes } from './routes/auth'
import { cartRoutes } from './routes/cart'
import fastifySwaggerUi from "@fastify/swagger-ui";

const app = Fastify({
    logger: true // Habilita o log de erros e alertas
}).withTypeProvider<ZodTypeProvider>()  // -> Pro Swagger

app.register(cors, {
    origin: process.env.CORS_ORIGIN || '*', // Utiliza a variável de ambiente ou um fallback (ex: '*')
    credentials: true,
    methods: ['POST', 'PUT', 'GET', 'DELETE']  // Métodos permitidos
})

app.register(jwt, {
    secret: process.env.JWT_SECRET_KEY
});

// Using Swagger
app.register(fastifySwagger, {
    openapi: {
        info: {
            title: 'Mercadinho API',
            version: '1.0.0'
        }
    },
    transform: jsonSchemaTransform
})
app.register(fastifySwaggerUi, {
    routePrefix: '/docs'
})

// fastify-type-provider-zod
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// Utilizar Interfaces de API pra testar. (Ex: Postman, insomnia, hoppscotch)
// Importar Rotas
app.register(authRoutes)
app.register(userRoutes)
app.register(cartRoutes)

const port = process.env.SERVER_PORT || 3333;
const host = '0.0.0.0';
// http://localhost:3333
// http://localhost:3333/docs
app.listen({ port, host }).then(() => {
    console.log(`🚀 Server is running on http://${host}:${port}`);
})