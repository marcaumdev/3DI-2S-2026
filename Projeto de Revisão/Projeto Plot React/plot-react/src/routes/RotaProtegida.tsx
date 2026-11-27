import { Navigate, Outlet } from "react-router-dom";
import { obterUsuario, sessaoValida } from "../services/sessaoService";
import type { usuario } from "../types/usuario";

interface Props {
    perfilPermitido?: usuario["tipoUsuario"];
}

// Componente responsável por proteger rotas que exigem autenticação
function RotaProtegida ({ perfilPermitido } : Props) {

    // Verifica se existe uma sessão com token e prazo de expiração válido
    if(!sessaoValida()) {
        // Navigate: componente do React Router que redireciona para outra rota
        // replace: substitui a rota atual no histórico de navegação, evitando voltar para ela 
        return <Navigate to="/" replace />
    } 

    // Recupera os dados do usuário autenticado
    const usuario = obterUsuario();

    // Verifica se os dados do usuário estão disponíveis
    if(!usuario){
        return <Navigate to="/" replace />;
    }

    //
    if(perfilPermitido && usuario.tipoUsuario !== perfilPermitido){
        return <Navigate to="/" replace />
    }

    // Outlet: exibe a página filha quando o acesso é permitido
    // página filha de login -> home
    return <Outlet />
}

export default RotaProtegida;