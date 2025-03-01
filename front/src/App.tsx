import { AuthProvider } from "./contexts/AuthContext"
import { CountProvider } from "./contexts/CountContext"
import AppRouter from "./routes"
// Toastify
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
// Theme
import ToggleTheme from './components/ToggleTheme'
import VersionSpan from "./components/VersionSpan"


const App = () => {
  return (
    <CountProvider>
      <AuthProvider>
        {/* <RouterProvider router={router} /> */}
        <AppRouter />
        <ToastContainer autoClose={1500} theme="colored" />
        <ToggleTheme />
        <VersionSpan />
      </AuthProvider>
    </CountProvider>
  )
}

export default App