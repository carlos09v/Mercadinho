import { useContext, useState } from "react"
import { CountContext } from "../../contexts/CountContext"
import Tree from '../../assets/Tree/tree1-unsplash.jpg'
import { api } from "../../lib/axios"
import { AuthContext } from "../../contexts/AuthContext"
import { toast } from "react-toastify"
import { CashLabel } from "../CashLabel"


const Farm = () => {
  const { cashCount, setCashCount } = useContext(CountContext)
  const { setUser, user } = useContext(AuthContext)
  const [loading, setLoading] = useState(false) // Loading to disable the button and prevent make another request

  // Update Money
  const saveMoney = async () => {
    try {
      setLoading(true)
      const { data } = await api.put('/users/save-money', {
        cash: cashCount
      })

      if (user) {
        setUser({
          ...user,
          cash: data.user.cash
        });
      } else throw new Error('User is null')

      setCashCount(0)
      toast.success(data.message)
    } catch (error) {
      console.log(error)
      toast.error('Ocorreu algum erro !')
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="divMain flex flex-col justify-center items-center max-w-4xl gap-6 relative">
      <div className="bg-blackModified dark:bg-whiteModified dark:text-blackModified text-white p-3 text-3xl rounded-lg">
        R$ <span className="font-semibold">{cashCount.toFixed(2)}</span>
      </div>

      <CashLabel totCash={user?.cash || 0} />

      <div className="w-[460px] h-[460px] rounded-full bg-gray-300 border-2 border-green-500 p-3 mt-2">
        <img src={Tree} alt="AvatarUrl" className="w-full h-full rounded-full hover:scale-105 duration-300 cursor-pointer" onClick={() => setCashCount(prevState => prevState += 0.20)} />
      </div>

      {cashCount ? (
        <button disabled={loading} onClick={saveMoney} className="btn bg-purple-500 mt-4 disabled:opacity-50">Salvar na Carteira</button>
      ) : (
        <div className="dark:text-whiteModified flex flex-col items-center">
          <p>👆 Clique na imagem para fazer dinheiro 👆</p>
          <i className="text-sm">(Obs: 20 cents per Click)</i>
        </div>
      )}
    </div>
  )
}

export default Farm