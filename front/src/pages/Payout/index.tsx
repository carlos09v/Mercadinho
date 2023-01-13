import { useContext, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import Logo from "../../components/Logo"
import './Payout.css'
import { FaCashRegister } from 'react-icons/fa'
import { IoMdArrowBack } from 'react-icons/io'
import { AuthContext } from "../../contexts/AuthContext"
import ChoosePayout from "../../components/Payout/ChoosePayout"
import ReviewPayout from "../../components/Payout/ReviewPayout"


const Payout = () => {
  const navigate = useNavigate()
  const buttonBackRef = useRef<HTMLButtonElement>(null)
  const { cart, user } = useContext(AuthContext)
  const STEPS = ['ChoosePayout', 'ReviewPayout']
  const [currentStep, setCurrentStep] = useState(STEPS[0])
  // ChoosePayoutMethod
  const [inputPayout, setInputPayout] = useState('')

  // Show Up BackButton
  if(buttonBackRef.current?.style.display === 'none') {
    buttonBackRef.current.style.display = 'flex'
  }

  useEffect(() => {
    if(!user || !cart) {
      navigate('/dashboard')
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center mt-8 gap-6 font-semibold dark:text-white">
      <button ref={buttonBackRef} className="payoutButtonBack" onClick={() => navigate('/dashboard')}>
        <IoMdArrowBack className="inline-block text-lg" />
        Voltar
      </button>

      <div className="register-container !max-w-4xl min-h-[0]">
        <div className="register-header">
          <Logo />
        </div>

        {currentStep === STEPS[0] && <ChoosePayout setCurrentStep={setCurrentStep} setInputPayout={setInputPayout} inputPayout={inputPayout} />}
        {currentStep === STEPS[1] && <ReviewPayout buttonBackRef={buttonBackRef} setCurrentStep={setCurrentStep} inputPayout={inputPayout} />}

      </div>
    </div>
  )
}

export default Payout