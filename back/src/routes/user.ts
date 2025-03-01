import { prisma } from '../lib/prisma'
import { z } from 'zod'
import { authenticate } from '../plugins/authenticate'
import { FastifyTypeInstace } from '../lib/swagger'

export const userRoutes = async (app: FastifyTypeInstace) => {
    // Get users count
    app.get('/users/count', {
        schema: {
            tags: ['users'],
            description: 'Get users count'
        }
    }, async () => {
        const count = await prisma.user.count()

        return { count }
    })

    // Get users list
    app.get('/users', {
        schema: {
            tags: ['users'],
            description: 'Get users list',
            response: {
                200: z.array(z.object({
                    id: z.string().uuid(),
                    name: z.string().max(20).nullish(),
                    avatarUrl: z.string().url().nullish(),
                    email:  z.string().email(),
                    cash: z.number(),
                    createdAt: z.date()
                }))
            }
        }
    }, async () => {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                avatarUrl: true,
                cash: true,
                createdAt: true,
                email: true
                // Except password 
            }
        })

        return users
    })

    // Create User
    app.post('/create-account', {
        schema: {
            description: 'Sign-up',
            tags: ['users'],
            body: z.object({
                email: z.string().email().trim(),
                password: z.string().min(6, 'A senha precisa ter no minimo 6 caracteres').max(20, 'A senha precisa ter até 20 caracteres !').trim()
            }),
            response: {
                201: z.object({
                    message: z.string(),
                    idUser: z.object({
                        id: z.string().uuid()
                    })
                }),
                404: z.object({
                    message: z.string()
                })
            }
        }
    }, async (req, res) => {
        const { email, password } = req.body

        // Register and get Id
        try {
            const idUser = await prisma.user.create({
                data: {
                    email,
                    password
                },
                select: {
                    id: true
                }
            })

            res.status(201).send({
                message: 'Usuário cadastrado com sucesso !',
                idUser
            })
        } catch (err) {
            console.log(err)
            res.status(404).send({ message: 'Email ja utilizado/criado !' })
        }

    })

    // Update User
    app.put('/users/update-user', {
        onRequest: [authenticate],
        schema: {
            description: 'Update User',
            tags: ['users'],
            body: z.object({
                name: z.string().max(20).trim().nullish(),
                avatarUrl: z.string().trim().nullish().transform(value => value === "" ? null : value)
            }),
            response: {
                200: z.object({
                    updatedUser: z.object({
                        name: z.string().max(20).nullish(),
                        avatarUrl: z.string().url().nullish()
                    }),
                    message: z.string()
                })
            }
        }
    }, async (req, res) => {
        const { name, avatarUrl } = req.body

        // Update and Return User
        const updatedUser = await prisma.user.update({
            where: {
                email: req.user.email
            },
            data: {
                name,
                avatarUrl
            },
            select: {
                name: true,
                avatarUrl: true
            }
        })

        res.status(200).send({ updatedUser, message: 'Dados salvos com sucesso!' })
    })

    // Save Money
    app.put('/users/save-money', {
        onRequest: [authenticate],
        schema: {
            description: 'Update/save money',
            tags: ['users'],
            body: z.object({
                cash: z.number()
            }),
            response: {
                200: z.object({
                    user: z.object({
                        cash: z.number()
                    }),
                    message: z.string()
                }),
                400: z.object({
                    errorMessage: z.string()
                })
            }
        }
    }, async (req, res) => {
        const { cash } = req.body

        try {
            const user = await prisma.user.update({
                where: {
                    email: req.user.email
                },
                data: {
                    cash: {
                        increment: cash
                    }
                },
                select: {
                    cash: true
                }
            })
    
            res.status(200).send({ user, message: 'Dinheiro salvo na carteira!' })
        } catch (err) {
            console.log(err)
            res.status(400).send({ errorMessage: 'Algo deu errado ao tentar excluir !' })
        }
    })

    // Forgot Password
    app.post('/forgot-password', {
        schema: {
            description: 'Forget password',
            tags: ['utils'],
            body: z.object({
                email: z.string().email().trim()
            }),
            response: {
                200: z.object({
                    password: z.string()
                }),
                404: z.object({
                    message: z.string()
                })
            }
        }
    }, async (req, res) => {
        const { email } = req.body
        
        // Get Password
        const passwordUser = await prisma.user.findUnique({
            where: {
                email
            },
            select: {
                password: true
            }
        })

        if (!passwordUser) return res.status(404).send({ message: 'Email não encontrado !' })

        return passwordUser
    })

    // Delete Account
    app.delete('/users/delete-user/:email', {
        onRequest: [authenticate],
        schema: {
            description: 'Delete User',
            tags: ['users'],
            params: z.object({
                email: z.string().email()
            })
        }
    }, async (req, res) => {
        const { email } = req.params

        if (email !== req.user.email) return res.status(404).send({ message: 'Email Incorreto ou não existe !' })

        try {
            await prisma.user.delete({
                where: {
                    email
                }
            })

            // Note: There's no need to delete the other tables due to onDelete: Cascade
            res.status(200).send({ message: 'Conta deletada com sucesso !' })
        } catch (err) {
            console.log(err)
            res.status(400).send({ errorMessage: 'Algo deu errado ao tentar excluir !' })
        }
    })
}