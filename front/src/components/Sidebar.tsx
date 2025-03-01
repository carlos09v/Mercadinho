import { useContext, useRef } from 'react'
import { useNavigate } from "react-router-dom"
import { FiHome, FiSettings } from 'react-icons/fi'
import { BiLogOut } from 'react-icons/bi'
import { MdOutlineShoppingCart, MdOutlineLocalPrintshop } from 'react-icons/md'
import { BsCartCheck } from 'react-icons/bs'
import { GiCash } from 'react-icons/gi'

import { SideBarIconProps, SideBarProps } from "../@types/web"
import { AuthContext } from "../contexts/AuthContext"
import clsx from 'clsx'

const SideBarBody = ({ icon, text = 'Vazio', to, isActive = false, deleteCookie = false, type, customClass, styleTooltip }: SideBarIconProps) => {
  const navigate = useNavigate()
  const { signOut } = useContext(AuthContext)

  const handleClick = () => {
    if (to) navigate(to);
    if (deleteCookie) signOut();
  };

  return (
    <div
      className={clsx("nav-icon group", customClass)}
      onClick={handleClick}
    >
      {icon}
      <span
        className={clsx("group-hover:scale-100", {
          'headerbar-tooltip': type === 'header',
          'sidebar-tooltip': type === 'aside',
          [styleTooltip || '']: styleTooltip
        })}
      >
        {text}
      </span>
      <span
        className={clsx(
          'text-green-500 font-bold absolute',
          { 'top-11': type === 'header' },
          { 'left-14': type === 'aside' },
          { hidden: !isActive }
        )}
      >
        {type === 'header' ? '^' : '<'}
      </span>
    </div>
  );
}

const SideBar = ({ type, toggleStage, setToggleStage, visible }: SideBarProps) => {
  const navigate = useNavigate();
  const { signOut } = useContext(AuthContext);
  if (!visible) return null; // 🔥 Se não for visível, nem renderiza

  // Lista de itens de navegação
  const navItems = [
    {
      icon: <BiLogOut />,
      text: 'SAIR',
      to: '/',
      deleteCookie: true,
      customClass: `text-red-500 ${type === 'aside' ? "mb-8 mt-8" : "mr-12"}`,
      styleTooltip: "text-red-500"
    },
    {
      icon: <FiHome />,
      text: 'Home',
      to: '/'
    },
    {
      key: 'Shop',
      icon: <MdOutlineShoppingCart />,
      text: 'Shop',
      onClick: () => setToggleStage('Shop')
    },
    {
      key: 'Farm',
      icon: <GiCash />,
      text: 'Fazenda/Farm',
      onClick: () => setToggleStage('Farm')
    },
    {
      icon: <MdOutlineLocalPrintshop />,
      text: 'Imprimir/Print',
      customClass: "text-yellow-400",
      styleTooltip: "text-yellow-200",
      onClick: () => window.print()
    },
    {
      key: 'Cart',
      icon: <BsCartCheck />,
      text: 'Carrinho/Cart',
      customClass: "text-purple-400",
      styleTooltip: "text-purple-400",
      onClick: () => setToggleStage('Cart')
    },
    {
      key: 'Settings',
      icon: <FiSettings />,
      text: 'Configurações',
      customClass: "text-gray-400 self-end",
      onClick: () => setToggleStage('Settings')
    }
  ];

  // Define o container com base no tipo
  const Container = type
  const containerClass = type === 'header'
    ? "nav mx-auto flex justify-center items-center rounded-b-full max-w-3xl border-b-2 w-[90%] py-2"
    : "nav fixed top-0 left-0 h-screen px-4 flex flex-col border-r-2";

  return (
    <Container className={containerClass}>
      {navItems.map((item) => (
        <button
          key={item.key}
          onClick={item.onClick ? item.onClick : () => {
            if (item.to) navigate(item.to);
            if (item.deleteCookie) signOut();
          }}
          // Se precisar usar refs específicos, você pode tratá-los aqui
        >
          <SideBarBody
            type={type}
            icon={item.icon}
            text={item.text}
            to={item.to}
            customClass={item.customClass}
            styleTooltip={item.styleTooltip}
            isActive={toggleStage === item.key}
            deleteCookie={item.deleteCookie}
          />
        </button>
      ))}
    </Container>
  );
}



export default SideBar


