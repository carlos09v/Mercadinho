import { useContext, useEffect, useState } from "react"

import Settings from "../../components/Settings"
import SideBar from "../../components/Sidebar"
import Shop from "../../components/Shop"
import Cart from "../../components/Cart"
import './Dashboard.css'
import Farm from "../../components/Farm"
import { SidebarType } from "../../@types/web"
import { AuthContext } from "../../contexts/AuthContext"
import { CountContext } from "../../contexts/CountContext"

const Dashboard = () => {
  const STAGES = ['Settings', 'Shop', 'Cart', 'Farm']
  const [toggleStage, setToggleStage] = useState(STAGES[1])
  const [sidebarType, setSidebarType] = useState<SidebarType>(localStorage.getItem('sidebar') as SidebarType || 'header');
  const { user, getUser } = useContext(AuthContext)
  const { productsCount, getProductsUserCount } = useContext(CountContext)
  
  // Atualiza o localStorage sempre que o sidebarType muda
  useEffect(() => {
    localStorage.setItem('sidebar', sidebarType);
  }, [sidebarType]);


  useEffect(() => {
    if(!user) getUser()
    if(!productsCount) getProductsUserCount()
  }, [])


  return (
    <>
      {/* Renderiza os SideBar com base no tipo e na visibilidade */}
      <SideBar
        type="header"
        visible={sidebarType === 'header'}
        setToggleStage={setToggleStage}
        toggleStage={toggleStage}
      />
      <SideBar
        type="aside"
        visible={sidebarType === 'aside'}
        setToggleStage={setToggleStage}
        toggleStage={toggleStage}
      />

      {/* Renderiza a tela baseada no toggleStage */}
      {toggleStage === 'Settings' && (
        <Settings sidebarType={sidebarType} setSidebarType={setSidebarType} />
      )}
      {toggleStage === 'Shop' && (
        <Shop setToggleStage={setToggleStage} />
      )}
      {toggleStage === 'Cart' && (
        <Cart />
      )}
      {toggleStage === 'Farm' && (
        <Farm />
      )}
    </>
  )
}

export default Dashboard
