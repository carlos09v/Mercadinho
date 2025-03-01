import { AuthContext } from "../../../contexts/AuthContext"
import { FormEvent, useContext, useState } from 'react'
import { CountContext } from "../../../contexts/CountContext"
import { api } from "../../../lib/axios"
import { toast } from "react-toastify"
import { AiFillDelete } from "react-icons/ai"
import Pagination from "./TablePagination"

const Table = ({ hideDelete = false }: { hideDelete?: boolean }) => {
    const { setProductsCount } = useContext(CountContext)
    const { cart, setCart } = useContext(AuthContext)
    // Pagination
    const [currentPage, setCurrentPage] = useState(1)
    const productsPerPage = 8
    const lastProductIndex = currentPage * productsPerPage
    const firstProductIndex = lastProductIndex - productsPerPage
    const currentProducts = cart?.slice(firstProductIndex, lastProductIndex)
    const [loading, setLoading] = useState(false)

    // Delete Product
    const deleteProduct = async (e: FormEvent, id: string) => {
        e.preventDefault()

        try {
            setLoading(true)
            const { data } = await api.delete(`/cart/delete-product/${id}`)

            toast.success(data.message)
            
            setCart((prevCart) => prevCart ?  prevCart.filter((product) => product.id !== id) : null)
    
            setProductsCount((prev) => prev ? prev - 1 : null)
        } catch (err: any) {
            if (err.response) return toast.error(err.response.data.errorMessage)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            {!cart || cart.length === 0 ? (
                <p className="text-lg font-semibold text-green-600 dark:text-green-400 text-center mt-1">- Não existe nenhum produto no carrinho :(</p>
            ) : (
                <div className="flex flex-col items-center gap-4">
                    <table className="max-w-[70%] mx-auto mt-4 dark:text-white rounded-lg overflow-hidden shadow-lg">
                        <thead>
                            <tr className="text-xl bg-purple-500 dark:bg-blue-700 text-slate-100">
                                <th className="text-lg">No.</th>
                                <th></th>
                                <th></th>
                                <th>Produto</th>
                                <th>Preço</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentProducts?.map((prod, i) => (
                                <tr key={i} className='font-semibold'>
                                    <td>{i + 1}</td>
                                    <td>{prod.category}</td>
                                    <td>{new Date(prod.addedAt).toLocaleDateString()}</td>
                                    <td>{prod.productName}</td>
                                    <td className="dark:text-green-400 text-blue-700">R$ {prod.productPrice}</td>
                                    {!hideDelete && !loading && (
                                        <td className="absolute ml-3 rounded p-2 bg-red-500 cursor-pointer hover:scale-105 duration-300 group" onClick={e => deleteProduct(e, prod.id)}>
                                            <AiFillDelete className="fill-white/90 hover:fill-white text-lg duration-300" />
                                            <span className="deleteProduct-tooltip group-hover:scale-100 left-12 top-0" >Excluir</span>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Table Paginaton  */}
                    <Pagination totalProducts={cart.length} productsPerPage={productsPerPage} setCurrentPage={setCurrentPage} currentPage={currentPage} />
                </div>
            )}
        </div>
    )
}

export default Table