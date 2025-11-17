import Login from "./pages/Login"
import SignUp from "./pages/SignUp"
import HomePage from "./pages/HomePage"
import {Routes,Route} from "react-router"
function App(){
  return(
    <>
    <Routes>
      <Route path="/" element={<HomePage></HomePage>}></Route>
      <Route path="/login" element={<Login></Login>}></Route>
      <Route path="/signup" element={<SignUp></SignUp>}></Route>
    </Routes>
    </>
  )
}
export default App