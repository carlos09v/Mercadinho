import { createContext, ReactNode, useEffect, useState } from "react";
import { CountContextProps } from "../@types/web";
import { api } from "../lib/axios";


// Context + Provider
//Função que constroe o Provider e também permite Consumir os Dados Globais
export const CountContext = createContext({} as CountContextProps)

//Componente Provider para passar os valores para os Childrens
export function CountProvider({ children }: { children: ReactNode }) {
    const [countUser, setCountUser] = useState<number | null>(null)
    const [countCart, setCountCart] = useState<number | null>(null)
    const [productsCount, setProductsCount] = useState<number | null>(null)
    const [cashCount, setCashCount] = useState(0)

    // Reset
    const resetCounts = () => {
        setCountCart(null)
        setCountUser(null)
        setProductsCount(null)
        setCashCount(0)
    }

    const getUsersCount = async () => {
        const { data } = await api.get('/users/count')
        setCountUser(data.count)
    }
    const getCartsCount = async () => {
        const { data } = await api.get('/cart/products/count')
        setCountCart(data.count)
    }

    // Get ProductsCount by User
    const getProductsUserCount = async () => {
        const { data } = await api.get('/cart/user/count')
        setProductsCount(data.countCartUser)
    }


    return (
        <CountContext.Provider value={{ countUser, countCart, getCartsCount, getUsersCount, getProductsUserCount, productsCount, resetCounts, setProductsCount, cashCount, setCashCount }}>
            {children}
        </CountContext.Provider>
    )
}