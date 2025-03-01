import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { authenticate } from '../plugins/authenticate'
import { FastifyTypeInstace } from '../lib/swagger'

export const authRoutes = async (app: FastifyTypeInstace) => {
    // Return User
    app.get('/me', {
        onRequest: [authenticate],
        schema: {
            description: 'Get User',
            tags: ['users'],
            response: {
                200: z.object({
                    userToken: z.object({
                        sub: z.string(),
                        email: z.string().email(),
                        name: z.string().max(20).nullish(),
                        avatarUrl: z.string().url().nullish()
                    }),
                    userDB: z.object({
                        id: z.string().uuid(),
                        name: z.string().max(20).nullish(),
                        avatarUrl: z.string().url().nullish(),
                        email: z.string().email(),
                        password: z.string(),
                        cash: z.number(),
                        createdAt: z.date()
                    }).nullable()
                })
            }
        }
    }, async req => {
        const userToken = req.user
        const userDB = await prisma.user.findUnique({
            where: {
                email: req.user.email
            }
        })

        return { userToken, userDB }
    })

    // Login - Return Token
    app.post('/login', {
        schema: {
            description: 'Sign-in and token',
            tags: ['users'],
            body: z.object({
                email: z.string().email(),
                password: z.string().min(6, 'A senha precisa ter no minimo 6 caracteres').max(20, 'A senha precisa ter até 20 caracteres !').trim()
            }),
            response: {
                200: z.object({
                    token: z.string()
                }),
                403: z.object({
                    message: z.string()
                })
            }
        }
    }, async (req, res) => {
        const { email, password } = req.body

        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })

        // Validate Email e Password in DB
        if (!user) return res.status(403).send({ message: 'Email não encontrado !' })
        if (password !== user.password) return res.status(403).send({ message: 'Senha Incorreta !' })


        // --- PENSAVA Q PRECISAVA GUARDAR O TOKEN NO DB ---- 
        // // Verificar se o user possui o Token
        // let user = await prisma.user.findUnique({
        //     where: {
        //         token: userInfo.token
        //     }
        // })

        // // Cadastrar o usuario no DB caso ñ possua Token
        // if(!user) {
        //     user = await prisma.user.create({
        //         data: {
        //             token: access_token,
        //             email: userInfo.email,
        //             password: userInfo.password
        //         }
        //     })
        // }



        // Gerar Token
        const token = app.jwt.sign({
            email: user.email,
            name: user?.name,
            avatarUrl: user?.avatarUrl
        }, {
            sub: user.id, // Qm gerou o Token
            expiresIn: '1 days' // Qndo o Token expirar, o usuario é deslogado !
            // Refresh Token -> pra ser um Token sem expirar
        })
        // console.log(token)

        return { token }
    })

    // Confirm Payout
    app.delete('/confirm-payout/:methodPayout', {
        onRequest: [authenticate],
        schema: {
            description: 'Confirm Payout',
            tags: ['utils'],
            params: z.object({
                methodPayout: z.string().transform(v => parseInt(v))
            }),
            querystring: z.object({
                finance: z.string().transform(v => parseInt(v))
            })
        }
    }, async (req, res) => {
        const { methodPayout } = req.params
        const { finance } = req.query

        // Validations
        try {
            // Buscar os preços dos produtos no carrinho
            const prices = await prisma.cart.findMany({
                where: { userId: req.user.sub },
                select: { productPrice: true },
            });

            // Buscar cash do user
            const userCash = await prisma.user.findUnique({
                where: {
                    email: req.user.email
                },
                select: {
                    cash: true
                }
            })
            if (!userCash) {
                return res.status(404).send({ message: "Usuário não encontrado." });
            }

            // Validation
            // Calcular o preço total base dos produtos
            const totPriceBase = prices.reduce(
                (acc, p) => acc + p.productPrice,
                0
            );

            let totPrice = totPriceBase;
            let totValueFinance = 0;
            // Ajusta o valor total de acordo com o método de pagamento
            switch (methodPayout) {
                case 1:
                    totPrice = totPriceBase - totPriceBase * 0.1;
                    break;
                case 2:
                    totPrice = totPriceBase - totPriceBase * 0.05;
                    break;
                case 3:
                    totPrice = totPriceBase / 2;
                    break;
                case 4:
                    totPrice = totPriceBase + totPriceBase * 0.2;
                    if (!finance || finance <= 0) {
                        return res
                            .status(400)
                            .send({ message: "Finance must be a valid number for installments." });
                    }
                    totValueFinance = totPrice / finance;
                    break;
                default:
                    return res
                        .status(400)
                        .send({ message: "Método de pagamento inválido." });
            }

            // Validar se o usuário possui saldo suficiente
            if (methodPayout !== 4) {
                if (userCash.cash < totPrice) {
                    return res
                        .status(400)
                        .send({ messageError: "Você não tem dinheiro suficiente na carteira :(" });
                }
            } else {
                if (totValueFinance > userCash.cash) {
                    return res
                        .status(400)
                        .send({ messageError: "Você não tem dinheiro suficiente para a parcela :(" });
                }
            }

            // Calcula o valor a ser decrementado do saldo do usuário
            const decrementAmount =
                methodPayout === 4 ? totPrice / finance : totPrice;

            // Atualiza o saldo do usuário (decrementando o valor adequado)
            const userCashAndCart = await prisma.user.update({
                where: { email: req.user.email },
                data: {
                    cash: { decrement: decrementAmount },
                },
                select: { cash: true, cart: true },
            });

            /* -> Ver lógica pra fazer o backup do Cart
        userCash.cart.map(cart => {
            if(!cart.backupCartId) {
                
            }
        })
        await prisma.backupCart.create({
            data: {
                backupCart: {
                    
                }
            }
        })
        */

            await prisma.cart.deleteMany({
                where: {
                    userId: req.user.sub
                }
            })

            res.status(200).send({
                message: 'Pagamento efetuado com sucesso !',
                userCashAndCart
            })
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Erro ao processar pagamento." });
        }
    })
}