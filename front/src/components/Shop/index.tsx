import { motion } from "framer-motion"
import { FormEvent, useContext, useLayoutEffect, useRef, useState } from "react"
import { toast } from "react-toastify"
import { CartProps } from "../../@types/user"
import { api } from "../../lib/axios"
import { MdShoppingCart } from 'react-icons/md'
import Input from "../Input"
import { CountContext } from "../../contexts/CountContext"
import { AuthContext } from "../../contexts/AuthContext"

interface ShopProps {
  setToggleStage: (stage: string) => void
}

const Shop = ({ setToggleStage }: ShopProps) => {
  const [data, setData] = useState([])
  const [filter, setFilter] = useState('')
  const [search, setSearch] = useState('')
  const [cartDataRegister, setCartDataRegister] = useState({ productName: '', productPrice: '', inputCategory: '' })
  const { productsCount, getProductsUserCount, setProductsCount } = useContext(CountContext)
  const { user, getUser, setCart } = useContext(AuthContext)
  const [loading, setLoading] = useState(false) // Loading to disable the button and prevent make another request

  const carousel = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  // DERIVED STATES
  // https://www.youtube.com/watch?v=kCpca2z2cls&t=636s
  // const filteredData = filter.length > 0 ? data.filter(repo => data.name.includes(filter)) : []


  // useLayoutEffect => You only want to use this hook when you need to do any DOM changes directly.
  // This hook is optimized, to allow the engineer to make changes to a DOM node directly before the browser has a chance to paint.
  useLayoutEffect(() => {
    // Largura Máxima do Drag no Carrossel
    // console.log(carrossel.current?.scrollWidth, carrossel.current?.offsetWidth)
    if (carousel?.current) {
      setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth)
    }
  }, [])

  const getDataAPI = async (e: FormEvent) => {
    e.preventDefault()

    // Validações
    if (search.length < 3) return toast.warn('Preencha o campo!')

  }

  // Register Product
  const handleCartRegister = async (e: FormEvent) => {
    e.preventDefault()

    // Validações
    if (cartDataRegister.productName === '' || cartDataRegister.productPrice === '' || cartDataRegister.inputCategory === '') return toast.warn('Preencha os dados do PRODUTO!')
    if (cartDataRegister.productName.length <= 2 || cartDataRegister.productName.length > 16) return toast.warn('O NOME precisa ter entre 2 e 16 dígitos !')

    try {
      setLoading(true)
      const { data } = await api.post('/cart/create-product', {
        productName: cartDataRegister.productName,
        productPrice: parseFloat(cartDataRegister.productPrice),
        category: cartDataRegister.inputCategory
      })

      toast.success(data.message)
      setProductsCount(prev => prev ? prev + 1 : null)
      if(!productsCount) getProductsUserCount()
        
      setCart(prevCart => prevCart ? [...prevCart, data.cart] : data.cart) // Adiciona os novos dados ao estado do cart
      setCartDataRegister({ productPrice: '', productName: '', inputCategory: '' })
      setLoading(false)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="divMain flex flex-col items-center max-w-4xl">
      {productsCount ? (
        <button className="btn absolute top-20 right-3 !max-w-[160px] !py-1 !px-1 dark:bg-blue-500/90 bg-[#E34382]/90 flex flex-col items-center justify-center gap-1" onClick={() => setToggleStage !== undefined ? setToggleStage('Cart') : null}>
          <span className="text-green-500 px-4 py-1 bg-[#111218e1] text-3xl shadow-lg rounded-md">{productsCount}</span>
          <div className="flex gap-2 items-center">
            Ver carrinho <MdShoppingCart />
          </div>
        </button>
      ): (null)}

      {/* <motion.h1 animate={{ x: 200, y: 100 }}>Bem-vindo(a) 😁 !</motion.h1> */}
      <h1 className="text-green-600 dark:text-green-400 border-green-600 dark:border-green-400 !max-w-sm mb-5 self-start">- Bem-vindo(a) 😁 !</h1>


      {/* SEARCH QUERY */}
      {/* <form onSubmit={getDataAPI} className="flex items-center justify-center gap-6">
        <Input
          id="search"
          placeholder="Procurar produto..."
          type="text"
          onChange={e => setSearch(e.target.value)}
          value={search}
        />

        <button type="submit" className="bg-green-600 !w-[100px] mb-4">Enviar</button>
      </form> */}

      {/* FILTER */}
      {/* {search.length > 0 && (
        <div className="w-[25%]">
          <Input
            id="filter"
            placeholder="Buscar..."
            type="text"
            onChange={e => setFilter(e.target.value)}
            value={filter}
          />
        </div>
      )} */}


      {/* <motion.div ref={carousel} whileTap={{ cursor: 'grabbing' }} className="cursor-grab overflow-hidden">
        <motion.div className="flex items-center justify-center mx-auto" drag='x' dragConstraints={{ right: 0, left: -width }} initial={{ x: 100 }} animate={{ x: 0 }} transition={{ duration: .8 }}>
          {filter.length > 0 ? (
            <ul>
              {filteredData.map((data, i) => (
                <motion.div key={i} className="h-[200px] w-[300px] p-4">
                  <div>
                    <img className="w-full h-[90%] rounded-xl pointer-events-none" src={data.img} alt="Carrossel Items" />
                  </div>
                  <div>
                    <span>{data.name}</span>
                    <span>{data.price}</span>
                  </div>
                </motion.div>
              ))}
            </ul>
          ) : (
            <ul>
              {data.map((data, i) => (
                <motion.div key={i} className="h-[200px] w-[300px] p-4">
                  <div>
                    <img className="w-full h-[90%] rounded-xl pointer-events-none" src={data.img} alt="Carrossel Items" />
                  </div>
                  <div>
                    <span>{data.name}</span>
                    <span>{data.price}</span>
                  </div>
                </motion.div>
              ))}
            </ul>
          )}
        </motion.div>
      </motion.div> */}

      <span className="font-semibold text-lg underline text-black dark:text-gray-200">- Em breve...</span>

      <div className="register-container !min-h-[270px] mt-3 relative max-w-[95%]">
        <h1 className="!text-2xl dark:text-white border-green-600 dark:border-green-400 mb-6">Adicionar produto</h1>
        {productsCount && productsCount >= 24 ? (
          <div className="text-lg font-semibold text-center">
            <p className="text-purple-500 dark:text-purple-400 mt-2">- Você atingiu o limite máximo de produtos no carrinho :( </p>
            <p className="text-green-600 dark:text-green-400 mt-2">Conclua a sua compra !</p>
          </div>
        ) : (
          <form onSubmit={handleCartRegister} className="mx-auto">
            <div className="flex gap-10 justify-center">
              <div className="flex gap-5 items-center font-bold">
                <label htmlFor="productName" className="mb-4 dark:text-whiteModified">Nome:</label>
                <Input
                  id="productName"
                  placeholder="Ex: Amendoim"
                  type="text"
                  maxLength={16}
                  onChange={(e: FormEvent) => setCartDataRegister({ ...cartDataRegister, productName: (e.target as HTMLTextAreaElement).value })}
                  value={cartDataRegister.productName}
                // productNameIcon={<MdShoppingCart className="absolute text-xl left-7 fill-white" />}
                />
              </div>
              <div className="flex gap-5 items-center font-bold">
                <label htmlFor="productPrice" className="mb-4 dark:text-whiteModified">Preço:</label>
                <Input
                  id="productPrice"
                  placeholder="Ex: 3.78"
                  type="number"
                  step="0.01"
                  maxLength={4}
                  max={1000000}
                  min={0.01}
                  onChange={(e: FormEvent) => setCartDataRegister({ ...cartDataRegister, productPrice: (e.target as HTMLInputElement).value })}
                  value={cartDataRegister.productPrice}
                  // productPriceIcon={<MdAttachMoney className="absolute text-xl left-7 fill-white" />}
                />
              </div>
            </div>

            <div className="mx-auto max-w-[30%] flex flex-col">
              <label className="mt-1 text-center font-bold dark:text-whiteModified" htmlFor="categoryOptions">Escolha uma Categoria:</label>
              <select className="mt-2 dark:text-black rounded" value={cartDataRegister.inputCategory} name="categoryOptions" id="categoryOptions" onChange={e => setCartDataRegister({ ...cartDataRegister, inputCategory: (e.target as HTMLSelectElement).value })}>
                <option className='text-center' value="" >--- ⬇️ ⬇️ ---</option>
                <option value="Food">Comida</option>
                <option value="Eletronics">Eletrônicos</option>
                <option value="Fruits">Frutas</option>
                <option value="Video_Games">Video Games</option>
                <option value="Clothes">Roupas</option>
                <option value="Sports">Esportes</option>
                <option value="House">Casa</option>
                <option value="Others">Outros</option>
              </select>
            </div>


            <button disabled={loading} type="submit" className="bg-purple-600 mx-auto block max-w-[30%] text-base mt-8 absolute right-3 bottom-3 disabled:opacity-50">Adicionar ao carrinho</button>
          </form>
        )}
      </div>

    </div>
  )
}

export default Shop