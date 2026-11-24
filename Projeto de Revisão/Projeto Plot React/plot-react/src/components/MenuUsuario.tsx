import { Link, useNavigate } from "react-router-dom";
import avatar from "../assets/avatar.png";
import { useState } from "react";
import { encerrarSessao, obterUsuario } from "../services/sessaoService";


function MenuUsuario() {

    const navigate = useNavigate();
    const [menuAberto, setMenuAberto] = useState(false);
    const usuario = obterUsuario();

    function gerenciarLogout() {
        encerrarSessao();
        navigate("/", { replace: true })
    }

    return (
        <div className="menu-usuario">
            <button className="usuario" type="button" onClick={() => setMenuAberto(!menuAberto)}>
                <img src={avatar} alt="Foto de perfil" />
                <span>Olá, {usuario?.nome}!</span>
                <i className="fa-solid fa-chevron-down"></i>
            </button>

            <div id="opcoes-usuario" 
                className={`opcoes-usuario ${menuAberto ? "aberto" : ""}`}>
                <Link to="/perfil">
                    <i className="fa-solid fa-user"></i>
                    Meu Perfil
                </Link>

                <button type="button" onClick={gerenciarLogout}>
                    <i className="fa-solid fa-right-from-bracket"></i>
                    Sair
                </button>
            </div>
        </div>
    );
}

export default MenuUsuario;