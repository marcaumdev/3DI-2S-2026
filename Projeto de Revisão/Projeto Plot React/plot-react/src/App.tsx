import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "./pages/Login/Login"
import Home from "./pages/Home/Home"
import RotaProtegida from "./routes/RotaProtegida"
import Detalhes from "./pages/Detalhes/Detalhes"
import Filmes from "./pages/Filmes/Filmes"


function App() {
  return (
    // habilita a navegação entre páginas
    <BrowserRouter>
      {/* agruopa as rotas da aplicação */}
      <Routes>
        {/* Route: associa um endereço a um componente 
            path: define o endereço da página
            element: define qual componente será exibido.
        */}
        <Route path="/" element={<Login />} />

        {/* Só consigo acessar a home, se estiver autenticado */}
        <Route element={<RotaProtegida />}>
          <Route path="/home" element={<Home />} />
        </Route>

        <Route element={<RotaProtegida />}>
          <Route path="/detalhes/:id" element={<Detalhes />} />
        </Route>

        <Route element={<RotaProtegida />}>
          <Route path="/filmes" element={<Filmes />} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App
