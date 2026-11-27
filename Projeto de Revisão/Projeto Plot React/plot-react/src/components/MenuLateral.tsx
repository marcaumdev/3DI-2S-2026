import { Link } from "react-router-dom";
import logo from "../assets/Logo vetorizado - claro.svg";
import { obterUsuario } from "../services/sessaoService";

function MenuLateral() {

    const usuario = obterUsuario();

    return (
        <aside className="menu-lateral">
            <img className="logo" src={logo} alt="Plot!" />

            <nav className="menu-navegacao">
                <Link to="/home" className="ativo">
                    <i className="fa-solid fa-house"></i>
                    <span>Catálogo</span>
                </Link>

                <a href="#">
                    <i className="fa-solid fa-bookmark"></i>
                    <span>Minhas Listas</span>
                </a>

                {/* Exibe o link de usuários somente se o usuário autenticado for administrador */}

                {usuario?.tipoUsuario === "Admin" &&
                    <Link to="/usuarios">
                        <i className="fa-solid fa-users"></i>
                        <span>Usuários</span>
                    </Link>
                }

                <Link to="/filmes">
                    <i className="fa-solid fa-film"></i>
                    <span>Filmes</span>
                </Link>
            </nav>
        </aside>
    );
}

export default MenuLateral;