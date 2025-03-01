import { createContext, ReactNode, useContext, useState } from "react";
import { CartProps, SignInData, UserProps } from "../@types/user";
import { AuthContextDataProps } from "../@types/auth";
import { api } from "../lib/axios";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { toast } from "react-toastify";
import { CountContext } from "./CountContext";
import { NavigateFunction } from "react-router-dom";


// Context + Provider
//Função que constroe o Provider e também permite Consumir os Dados Globais
export const AuthContext = createContext({} as AuthContextDataProps)

//Componente Provider para passar os valores para os Childrens
export function AuthProvider({ children }: { children: ReactNode }) {
    const { resetCounts, getProductsUserCount } = useContext(CountContext)
    const [cart, setCart] = useState<CartProps[] | null>(null)
    const [user, setUser] = useState<UserProps | null>(null)
   
    // TotProductsPrice
    let totProd = 0
    if (cart) {
        cart.forEach(prod => {
            totProd += prod.productPrice
        })
    }

    const getCart = async () => {
        const { data } = await api.get('/cart/user')
        setCart(data.cart.cart)
    }

    const signIn = async ({ email, password }: SignInData, navigate: NavigateFunction) => {
        // Validar o Email e Senha e Receber o Token JWT e o Cart[] do Back-end
        try {
            const { data } = await api.post(`/login`, {
                email,
                password
            })

            // Inserir o Token no Header das requisições
            api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`

            // Create Cookie
            // Context + Cookie Name + Value + Params
            setCookie(undefined, 'auth.token', data.token, {
                maxAge: 60 * 60 * 24 // 24 Hours
            })

            await getUser() // Receber o UserData
            await getProductsUserCount() // Get ProductsCount
            navigate('/dashboard')
        } catch (err: any) {
            if (err.response) toast.error(err.response.data.message)
            return false
        }
    }

    const getUser = async () => {
        const { 'auth.token': token } = parseCookies() // Pega o Token
        if (token) {
            try {
                const { data } = await api.get('/me')
                setUser(data.userDB)
            } catch (err) {
                console.log(err)
            }
        } else {
            console.log('Não existe token :(')
        }
    }

    const signOut = () => {
        setUser(null)
        setCart(null)
        resetCounts()
        destroyCookie(undefined, 'auth.token')
        // return <Navigate to='/' />
    }

    return (
        <AuthContext.Provider value={{ getCart, cart, user, signIn, signOut, getUser, setUser, setCart, totProd }}>
            {children}
        </AuthContext.Provider>
    )
}