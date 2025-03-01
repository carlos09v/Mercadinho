import { PayoutProps } from "../../@types/web"
import { AiOutlineRollback } from 'react-icons/ai'
import { AuthContext } from "../../contexts/AuthContext"
import { FormEvent, useContext, useState } from 'react'
import Table from "../Cart/Table"
import Input from "../Input"
import { api } from "../../lib/axios"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import clsx from "clsx"
import { CountContext } from "../../contexts/CountContext"

const ReviewPayout = ({ setCurrentStep, inputPayout }: PayoutProps) => {
  const navigate = useNavigate()
  const { user, totProd, setCart, setUser } = useContext(AuthContext)
  const { setProductsCount } = useContext(CountContext)
  // How many finances
  const [finance, setFinances] = useState('')
  const [loading, setLoading] = useState(false) // Loading to disable the button and prevent make another request


  let displayPayoutMethod = ''
  let discountLabel = ''
  let jurosLabel = ''
  let totLiquid: number = 0
  let totValueFinance: number = 0
  switch (inputPayout) {
    case '1':
      displayPayoutMethod = 'Á vista dinheiro/cheque 💵'
      discountLabel = '(10% de desconto)'
      totLiquid = totProd - (totProd * 10 / 100)
      break
    case '2':
      displayPayoutMethod = `Á vista Cartão débito 💳`
      discountLabel = '(5% de desconto)'
      totLiquid = totProd - (totProd * 5 / 100)
      break
    case '3':
      displayPayoutMethod = '2x no Cartão 💳'
      totLiquid = totProd / 2
      break
    case '4':
      displayPayoutMethod = `Parcelar até 12x no Cartão 💳`
      totLiquid = totProd + (totProd * 20 / 100)
      totValueFinance = totLiquid / parseInt(finance)
      jurosLabel = '(20% de Juros)'
      break
    default:
      displayPayoutMethod = 'Error: Alejandro !'
    // console.log(inputPayout)
  }
  const payoutValue = inputPayout === '4' ? totValueFinance : totLiquid

  // Process Payout
  const confirmPayout = async (e: FormEvent) => {
    e.preventDefault()

    // Validações
    if (inputPayout === '4' && parseInt(finance) <= 12) {
      if (totValueFinance! > user!.cash) return toast.error('Você não tem dinheiro suficiente, tente parcelar pra mais X ou faça mais dinheiro !')
    } else {
      if (totLiquid! > user!.cash) return toast.error('Você não tem dinheiro suficiente, tente dividir no Cartão !')
    }


    try {
      setLoading(true)
      const { data } = await api.delete(`/confirm-payout/${inputPayout}?finance=${inputPayout === '4' ? finance : null}`)

      toast.success(data.message)
      if(user) {
        setUser({ ...user, cash: data.userCashAndCart.cash })
      }
      setCart(null)
      setProductsCount(null)
      navigate('/dashboard')
    } catch (err: any) {
      console.log(err)
      if (err.response) toast.error(err.response.data.messageError)
      setLoading(false)
    }
  }

  return (
    <div className="reviewPayout">
      <button onClick={() => setCurrentStep('ChoosePayout')} className="payoutButtonBack">
        <AiOutlineRollback className="inline-block text-lg" />
        Trocar Pagamento
      </button>
      <div className="divMain w-full">
        <div className="flex justify-between">
          <div className="w-[65%]">
            <h2 className="text-xl">- Pagamento: <span className="dark:text-blue-400 text-purple-500">{displayPayoutMethod}</span>
            </h2>
            {discountLabel && (
              <p className="text-lg">- Desconto: <span id="discountGreen">{discountLabel}</span></p>
            )}
            {jurosLabel && (
              <p className="text-lg">- Juros: <span id="juros">{jurosLabel}</span></p>
            )}
            <div>
              <h3 className="mt-3 text-lg text-center">- Total dos seus produtos:
                <span id="discountGreen"> R$ {totProd.toFixed(2)} </span>
                {inputPayout === '1' && (
                  <>
                    <span id="discountBlue">- 10%</span>
                    <span> =</span>
                    <span id="discountGreen" className="text-xl font-bold"> R$ {totLiquid?.toFixed(2)}</span>
                  </>
                )}
                {inputPayout === '2' && (
                  <>
                    <span id="discountBlue">- 5%</span>
                    <span> =</span>
                    <span id="discountGreen" className="text-xl font-bold"> R$ {totLiquid?.toFixed(2)}</span>
                  </>
                )}
                {inputPayout === '3' && (
                  <>
                    <span id="discountBlue">÷ 2</span>
                    <span> =</span>
                    <span id="discountGreen" className="text-xl font-bold"> R$ {totLiquid?.toFixed(2)}</span>
                  </>
                )}
                {inputPayout === '4' && finance && parseInt(finance) >= 2 && parseInt(finance) <= 12 && (
                  <>
                    <span id="juros">+ 20%</span>
                    <span> =</span>
                    <span id="discountGreen" className="text-xl font-bold"> R$ {totValueFinance?.toFixed(2)} <span className="text-purple-500 dark:text-purple-400 text-lg">({finance}x)</span></span>
                  </>
                )}
              </h3>

              <Table hideDelete />
            </div>
          </div>

          {user && (
            <div className="max-w-[35%] max-h-[150px] flex flex-col">
              <div className="p-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-black rounded-t-md flex flex-col items-start justify-around gap-1 font-thin border-2 border-purple-500 dark:border-blue-500 ">
                {user.avatarUrl && (
                  <div className="w-20 h-20 rounded-full bg-gray-300 border-2 dark:border-blue-500 border-purple-500 p-1 self-center">
                    <img src={user.avatarUrl} alt="AvatarUrl" className="w-full rounded-full hover:scale-105 duration-300" />
                  </div>
                )}

                <p className="font-semibold">
                  Email: <span className="dark:text-blue-500  text-purple-400 font-normal">{user.email}</span>
                </p>
                {user.name && (
                  <p className="font-semibold">
                    Nome: <span className="dark:text-blue-500  text-purple-400 font-normal">{user.name}</span>
                  </p>
                )}
                <p>
                  Carteira:
                  <span className={clsx("font-bold", {
                    "dark:text-green-600 text-green-400": payoutValue <= user.cash,
                    "dark:text-red-500 text-red-500": payoutValue > user.cash,
                  })}>
                    R$ {user.cash.toFixed(2)}
                  </span>
                </p>
              </div>

              <div className="flex flex-col items-center gap-3 bg-slate-300 dark:bg-blue-600 rounded-b-3xl border-2 border-purple-500 dark:border-blue-600 p-2">
                {inputPayout === '4' && (
                  <div className="dark:text-black">
                    <Input
                      id="parcelasNumber"
                      labelname="Parcelar pra quantas X?"
                      placeholder="Ate 12x..."
                      type="number"
                      onChange={e => setFinances((e.target as HTMLInputElement).value)}
                      min={2}
                      max={12}
                    />
                  </div>
                )}
                {inputPayout !== '4' && (
                  <>
                    <p>Confirmar Pagamento ?</p>
                    <button disabled={loading} className="btn bg-green-600 text-sm w-[70px] duration-300 hover:bg-green-500 disabled:opacity-50" onClick={confirmPayout}>Sim</button>
                    <p></p>
                  </>
                )}
                {inputPayout === '4' && finance && parseInt(finance) >= 2 && parseInt(finance) <= 12 && (
                  <>
                    <p>Confirmar Pagamento ?</p>
                    <button disabled={loading} className="btn bg-green-600 text-sm w-[70px] duration-300 hover:bg-green-500 disabled:opacity-50" onClick={confirmPayout}>Sim</button>
                    <p></p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>



      </div>
    </div>
  )
}

export default ReviewPayout