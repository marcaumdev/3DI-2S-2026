import { Navigate, Outlet } from "react-router-dom";
import { sessaoValida } from "../services/sessaoService";

// Componente responsável por proteger rotas que exigem autenticação
function RotaProtegida () {

    // Verifica se existe uma sessão com token e prazo de expiração válido
    if(!sessaoValida()) {
        // Navigate: componente do React Router que redireciona para outra rota
        // replace: substitui a rota atual no histórico de navegação, evitando voltar para ela 
        return <Navigate to="/" replace />
    } 

    // Outlet: exibe a página filha quando o acesso é permitido
    // página filha de login -> home
    return <Outlet />
}

export default RotaProtegida;