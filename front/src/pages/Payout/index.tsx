import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Logo from "../../components/Logo"
import './Payout.css'
import { IoMdArrowBack } from 'react-icons/io'
import { AuthContext } from "../../contexts/AuthContext"
import ChoosePayout from "../../components/Payout/ChoosePayout"
import ReviewPayout from "../../components/Payout/ReviewPayout"


const Payout = () => {
  const navigate = useNavigate()

  const { cart, user } = useContext(AuthContext)
  const STEPS = ['ChoosePayout', 'ReviewPayout']
  const [currentStep, setCurrentStep] = useState(STEPS[0])
  // ChoosePayoutMethod
  const [inputPayout, setInputPayout] = useState('')


  useEffect(() => {
    if (!user || !cart) {
      navigate('/dashboard')
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center mt-8 gap-6 font-semibold dark:text-white">
      <button
        className="payoutButtonBack"
        onClick={() => navigate('/dashboard')}
      >
        <IoMdArrowBack className="inline-block text-lg" />
        Voltar
      </button>


      <div className="register-container !max-w-4xl min-h-[0]">
        <div className="register-header">
          <Logo />
        </div>

        {currentStep === 'ChoosePayout' && (
          <ChoosePayout
            setCurrentStep={setCurrentStep}
            setInputPayout={setInputPayout}
            inputPayout={inputPayout}
          />
        )}
        {currentStep === 'ReviewPayout' && (
          <ReviewPayout
            setCurrentStep={setCurrentStep}
            inputPayout={inputPayout}
          />
        )}
      </div>
    </div>
  )
}

export default Payout