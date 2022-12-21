import { useNavigate } from "react-router-dom"
import { destroyCookie } from 'nookies'

import { SideBarIconProps } from "../@types/web"

const SideBarIcon = ({ icon, text = 'Vazio', to, style, styleTooltip, deleteCookie = false }: SideBarIconProps) => {
  const navigate = useNavigate()
 
  return (
    <div id={`${style}`} className="nav-icon group" onClick={() => {
      to && navigate(`${to}`)
      deleteCookie && destroyCookie(undefined, 'auth.token')
      }}>
        {icon}
        <span id={`${styleTooltip}`} className="sidebar-tooltip group-hover:scale-100">{text}</span>
    </div>
  )
}

const HeaderBarIcon = ({ icon, text = 'Vazio', to, style, styleTooltip, deleteCookie = false }: SideBarIconProps) => {
  const navigate = useNavigate()
 
  return (
    <div id={`${style}`} className="nav-icon group" onClick={() => {
      to && navigate(`${to}`)
      deleteCookie && destroyCookie(undefined, 'auth.token')
      }}>
        {icon}
        <span id={`${styleTooltip}`} className="headerbar-tooltip group-hover:scale-100">{text}</span>
    </div>
  )
}



export { SideBarIcon, HeaderBarIcon }


