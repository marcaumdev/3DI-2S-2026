import { Link } from "react-router-dom";
import logo from "../assets/Logo vetorizado - claro.svg";

function MenuLateral() {
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

                    <Link to="/usuarios">
                        <i className="fa-solid fa-users"></i>
                        <span>Usuários</span>
                    </Link>

                    <Link to="/filmes">
                        <i className="fa-solid fa-film"></i>
                        <span>Filmes</span>
                    </Link>
                </nav>
            </aside>
    );
}

export default MenuLateral;