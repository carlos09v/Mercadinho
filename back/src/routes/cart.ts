import { prisma } from '../lib/prisma'
import { z } from 'zod'
import { authenticate } from '../plugins/authenticate'
import { Categories } from '@prisma/client'
import { FastifyTypeInstace } from '../lib/swagger'


export const cartRoutes = async (app: FastifyTypeInstace) => {
    // Contagem de Produtos criados
    app.get('/cart/products/count', {
        schema: {
            description: 'Get total products count',
            tags: ['cart'],
        }
    },async() => {
        const count = await prisma.cart.count()

        return { count }
    })

    // Lista de Produtos do User
    app.get('/cart/user', {
        onRequest: [authenticate],
        schema: {
            description: 'Get products in users cart',
            tags: ['cart'],
        }
    }, async(req) => {
        // Get the Cart from User
        const cart = await prisma.user.findUnique({
            where: {
                email: req.user.email
            },
            select: {
                cart: true
            }
        })

        return { cart }
    })

    // Contagem de Produtos no carrinho do Usuário
    app.get('/cart/user/count', {
        onRequest: [authenticate],
        schema: {
            description: 'Get products count in users cart',
            tags: ['cart'],
        }
    }, async(req) => {
        const countCartUser = await prisma.cart.count({
            where: {
                userId: req.user.sub
            }
        })

        return { countCartUser }
    })

    // Create Product
    app.post('/cart/create-product', {
        onRequest: [authenticate],
        schema: {
            description: 'Create a new product',
            tags: ['cart'],
            body: z.object({
                productName: z.string().min(2).max(16).trim(),
                productPrice: z.number().positive().max(1000000, 'Max value is 1000000'),
                category: z.enum([Categories.Clothes, Categories.Eletronics, Categories.Food, Categories.Fruits, Categories.House, Categories.Video_Games, Categories.Others, Categories.Sports])
            }),
            response: {
                201: z.object({
                    message: z.string(),
                    cart: z.object({
                        id: z.string().uuid(),
                        userId: z.string().uuid(),
                        backupCartId: z.string().uuid().nullish(),
                        productName: z.string(),
                        productPrice: z.number(),
                        category: z.enum([Categories.Clothes, Categories.Eletronics, Categories.Food, Categories.Fruits, Categories.House, Categories.Video_Games, Categories.Others, Categories.Sports]),
                        addedAt: z.date()
                    })
                }),
                400: z.object({
                    message: z.string()
                }),
            }
        }
    }, async(req, res) => {
        const { productName, productPrice, category } = req.body
        
        // Register
        try {
            const cart = await prisma.cart.create({
                data: {
                    productName,
                    productPrice,
                    category,
                    userId: req.user.sub
                }
            })

            res.status(201).send({ 
                message: 'Produto cadastrado com sucesso no carrinho !',
                cart
            })
        } catch (err) {
            console.log(err)
            res.status(400).send({ 
                message: 'Erro ao cadastrar produto no carrinho !'
            })
        }
    })

    // Delete Product
    app.delete('/cart/delete-product/:productId', {
        onRequest: [authenticate],
        schema: {
            description: 'Delete product in users cart',
            tags: ['cart'],
            params: z.object({
                productId: z.string().uuid()
            })
        }
    }, async(req, res) => {
        const { productId } = req.params

        try {
            await prisma.cart.delete({
                where: {
                    id: productId
                }
            })

            res.status(200).send({ message: 'Produto apagado/excluido !'})
        }catch (err) {
            console.log(err)
            res.status(400).send({ errorMessage: 'Algo deu errado ao tentar excluir !'})
        }
    })
}