import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../contexts/AuthContext"
import Modal from 'react-modal'
import { AiFillCloseSquare } from "react-icons/ai"
import { FaCashRegister } from 'react-icons/fa'
import { MdOutlineAttachMoney } from 'react-icons/md'
import { BsCashCoin } from 'react-icons/bs'
Modal.setAppElement('#root')
import './Cart.css'
import { useNavigate } from "react-router-dom"
import Table from "./Table"
import clsx from "clsx"
import { toast } from "react-toastify"
import Loading from "../Loading"


const Cart = () => {
  const navigate = useNavigate()
  const { user, totProd, getCart, cart } = useContext(AuthContext)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    // get Cart
    if (!cart) getCart()
  }, [])
  
  const handlePayout = () => {
    if(totProd > user!.cash) toast.warn('Você não tem dinheiro suficiente ! Recomendo dividir no Cartão :)')

    navigate(`/payout/${user!.id}`)
  }
  
  // Loading Component
  if(!cart) return <Loading />

  return (
    <div className="divMain flex flex-col justify-center max-w-4xl">
      <h1 className="text-purple-600 dark:text-purple-400 border-purple-600 dark:border-purple-400 !max-w-sm mb-6 self-start">- Seu carrinho 🛒:</h1>
      
      <Table  />
      {cart && cart.length > 0 && (
        <div className="mx-auto mt-6">
          {/* Open Cash Modal */}
          <span onClick={() => setShowModal(true)} className="cashModal"><a href="#"></a></span>
        </div>
      )}
      

      {/* Cash Modal */}
      <Modal isOpen={showModal} overlayClassName='modalExterior' className='modalInterior flex-col dark:text-white p-6'>
        <AiFillCloseSquare className="modalIconClose" onClick={() => setShowModal(false)} />
        <div className="absolute top-4 left-6">
          <h2 className="text-xl flex gap-2 border-b-2 border-purple-600 dark:border-purple-500 rounded-lg">- Você tem: <span className="font-semibold text-green-600 dark:text-blue-400 flex items-center justify-center gap-2">R$ {user?.cash.toFixed(2)} {<BsCashCoin className="fill-green-600 dark:fill-green-400" />}</span></h2>
        </div>
        <h1 className="text-2xl mb-6 mt-8">O total dos seus produtos é <span className={clsx("font-bold", {
          ["text-red-500 dark:text-red-500"]: totProd > user!.cash,
          ["text-green-600 dark:text-green-400"]: totProd <= user!.cash
        })}>R$ {totProd.toFixed(2)}</span> !</h1>
        <div className="flex flex-col items-center gap-3 w-[40%]">
          <button onClick={() => setShowModal(false)} className="btn text-base bg-purple-500 w-[90%] font-thin">Continuar comprando 🛒</button>
          <span>OU</span>
          <button className="btn cashPayoutButton shadow-xl dark:after:bg-slate-100 after:bg-gray-800 w-full dark:text-black text-emerald-300 group font-semibold" onClick={handlePayout}>
            <span className="flex items-center justify-center gap-3">OPÇÕES DE PAGAMENTO {<FaCashRegister />}</span>
            <span className="group-hover:scale-105 payoutButton-tooltip"><MdOutlineAttachMoney className="fill-green-500 text-xl" /></span>
          </button>
        </div>
      </Modal>

    </div>
  )
}

export default Cart