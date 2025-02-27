import HeaderHome from "../../components/HeaderHome"
import { useEffect, useLayoutEffect, useRef, useState, useContext } from "react"
import { motion } from 'framer-motion'

import { toys2Img, foodImg, headphoneImg ,shampoosImg, shoeImg, watchesImg, fruitsImg, toys1Img, controllersImg, patinsImg, snacksImg, drinksImg } from '../../assets/HomeGallery'
import HomeSvg from '../../assets/unDrawPics/sweet_home.svg'
import { CountContext } from "../../contexts/CountContext"
import './Home.css'

const Home = () => {
  // the first 4 images doesnt show up
  const images = [toys2Img, toys2Img, toys2Img, toys2Img, toys2Img, foodImg, headphoneImg, shoeImg, watchesImg, fruitsImg, toys1Img, controllersImg, shampoosImg, patinsImg, snacksImg, drinksImg]
  const carousel = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  const { countCart, countUser, getCartsCount, getUsersCount } = useContext(CountContext)

  useEffect(() => {
    if(!countUser || !countCart ) {
      // getUsersCount()
      // getCartsCount()
    }
  }, [])

  // useLayoutEffect => You only want to use this hook when you need to do any DOM changes directly.
  // This hook is optimized, to allow the engineer to make changes to a DOM node directly before the browser has a chance to paint.
  useLayoutEffect(() => {
    // Largura Máxima do Drag no Carrossel
    // console.log(carrossel.current?.scrollWidth, carrossel.current?.offsetWidth)
    if (carousel?.current) {
      setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth)
    }
  }, [])
  

  return (
    <>
      <HeaderHome />

      <main className="divMain max-w-7xl">
        <div className="flex justify-around items-center">
          <div className="dark:text-whiteModified text-blackModified">
            <h1 className="border-none !text-4xl">Simulando um</h1>
            <h1 className="border-[#111218] dark:border-blue-400 !text-5xl">E-commerce</h1>
            
            <div className="flex gap-3 mt-6 font-semibold">
              <p className="button-85">Contas criadas: <span className="text-2xl ml-3 bg-clip-text text-transparent bg-gradient-to-b from-green-500 to-[#FFB03A]">{countUser}</span></p>
              <p className="button-85">Produtos criados: <span className="text-2xl ml-3 bg-clip-text text-transparent bg-gradient-to-b from-green-500 to-[#FFB03A]">{countCart}</span></p>
            </div>
          </div>
          

          <div>
            <img className="w-[400px]" src={HomeSvg} alt="HomeSvg" />
          </div>
        </div>


        {/* <motion.h1 animate={{ x: 200, y: 100 }}>Bem-vindo(a) 😁 !</motion.h1> */}
        <motion.div ref={carousel} whileTap={{ cursor: 'grabbing' }} className="cursor-grab overflow-hidden mt-6">
          <motion.div className="flex items-center justify-center mx-auto" drag='x' dragConstraints={{ right: 0, left: -width }} initial={{ x: 100 }} animate={{ x: 0 }} transition={{ duration: .8 }}>
            {images.map((img, i) => (
              <motion.div key={i} className="h-[250px] min-w-[300px] p-4">
                <img className="w-full h-[90%] rounded-xl pointer-events-none" src={img} alt="Carrossel Items" />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

      </main>
    </>
  )
}

export default Home