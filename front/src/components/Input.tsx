import { InputProps } from "../@types/web"
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { useState } from "react"


const Input = (props: InputProps) => {
  const [icon, setIcon] = useState(true)
  // Estado para controlar se a senha está visível
  const [showPassword, setShowPassword] = useState(false);

  // Função para alternar a visibilidade da senha
  const handleTogglePassword = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div key={props.id} className="flex flex-col gap-2 mb-6 relative">
      {props.labelname && (
        <label 
          className="font-bold text-[#111218] dark:text-[#ededed] text-base" 
          htmlFor={props.id}
        >
          {props.labelname}
        </label>
      )}
      <input
        {...props}
        // Se for o input de senha, define o tipo de acordo com o estado, caso contrário usa o tipo passado em props
        type={props.id === 'password' ? (showPassword ? "text" : "password") : props.type}
        className="p-2 border-none rounded relative"
        name={props.type === 'radio' ? props.name : props.id}
      />
      {props.id === 'password' && (
        showPassword ? (
          <AiOutlineEyeInvisible 
            className="absolute top-[60%] right-3 text-xl fill-gray-500 hover:fill-gray-400 duration-200" 
            onClick={handleTogglePassword} 
          />
        ) : (
          <AiOutlineEye 
            className="absolute top-[60%] right-3 text-xl fill-gray-500 hover:fill-gray-400 duration-200" 
            onClick={handleTogglePassword} 
          />
        )
      )}
    </div>
  )
}

export default Input