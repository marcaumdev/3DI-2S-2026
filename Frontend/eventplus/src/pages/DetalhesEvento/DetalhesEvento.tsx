import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Presenca, Evento } from "../../types/api";

import imagemPadrao from "../../assets/banner-1.png"
import relogio from "../../assets/icons/relogio.svg"
import predio from "../../assets/icons/predio.svg"
import filtro from "../../assets/icons/filtro.svg"

import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Botao from "../../components/botao/Botao"

import "./DetalhesEvento.css"
import { eventoService } from "../../services/eventPlusservice";

function DetalhesEvento() {
    const { id = "" } = useParams();

    const [evento, setEvento] = useState<Evento | null>(null);
    const [secaoComentarios, setSecaoComentarios] = useState<boolean>(false);
    const [presenca, setPresenca] = useState<Presenca | null>(null);
    const [presencaCarregada, setPresencaCarregada] = useState("")
    const [confirmandoCancelamento, setConfirmandoCancelamento] = useState(false)

    useEffect(() => {

        async function carregar() {
            if (!id) return;

            const dados = await eventoService.buscar(id);

            setEvento(dados);
        }

        void carregar();
    }, [id])

    function mostrarEvento() {
        console.log(evento)
    }

    // const chavePresenca = usuario && id ? `${usuario.idUsuario}:${id}` : ""
    // const checandoPresenca = Boolean(chavePresenca && presencaCarregada !== chavePresenca)

    return (
        <>
            <Header />
            <main>
                <img src={evento?.imagemUrl || imagemPadrao} alt="Banner do evento" />
                <h1>{evento?.nome}</h1>
                <div>
                    <button onClick={() => setSecaoComentarios(false)}>Sobre o Evento</button>
                    <button onClick={() => setSecaoComentarios(true)}>Comentários</button>
                    {secaoComentarios ?
                        <h2>Comentários</h2>
                        :
                        <>
                            <p>{evento?.descricao}</p>
                        </>}
                </div>
                <div>
                    <h2>Informações principais</h2>
                    <hr />

                    <div>
                        <img src={relogio} alt="" />
                        <span>{evento?.dataEvento}</span>
                    </div>
                    <div>
                        <img src={predio} alt="" />
                        <span>{evento?.idInstituicaoNavigation?.nomeFantasia}</span>
                    </div>
                    <div>
                        <img src={filtro} alt="" />
                        <span>{evento?.idTipoEventoNavigation?.titulo}</span>
                    </div>
                    <Botao
                    className={presenca ? "detalhe-evento-cancelar" : ""}
                    // texto={}
                    />
                    
                </div>
            </main>
            <Footer />
        </>
    )
}

export default DetalhesEvento;