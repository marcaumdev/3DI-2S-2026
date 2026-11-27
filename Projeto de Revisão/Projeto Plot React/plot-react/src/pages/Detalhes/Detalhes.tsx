
import MenuLateral from "../../components/MenuLateral";
import MenuUsuario from "../../components/MenuUsuario";

import "./Detalhes.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Filme } from "../../types/filme";
import { buscarFilmeId } from "../../api/filmes";

function Detalhes() {

    const { id } = useParams();
    const [filme, setFilme] = useState<Filme | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        // Converte o ID recebido pela URL para número
        const idFilme = Number(id);

        async function carregarFilme() {
            setCarregando(true);
            setErro("");
            setFilme(null);

            try {
                // Consulta a API utilizando o ID do filme
                const resposta = await buscarFilmeId(idFilme);

                // Armazena o filme retornado pela API
                setFilme(resposta)
            } catch (error) {
                console.error("Erro ao carregar filme:", error);
                setErro("Não foi possível carregar os detalhes do filme.");
            } finally {
                setCarregando(false);
            }
        }

        if (idFilme > 0 && Number.isInteger(idFilme)) {
            carregarFilme();
        } else {
            setFilme(null);
            setErro("Filme inválido");
            setCarregando(false);
        }
    }, [id]);

    // Converte a duração de minutos para horas e minutos
    function formatarDuracao(minutos: number){
        const horas = Math.floor(minutos / 60);
        const minutosRestantes = minutos % 60;

        return `${horas}h ${minutosRestantes}min`
    }

    return (
        <div className="layout-principal">

            <MenuLateral />

            <main className="conteudo-principal">

                <header className="cabecalho">

                    <div className="titulo-pagina">
                        <h1>Detalhes do filme</h1>
                        <p>Aqui você encontra mais detalhes do filme selecionado.</p>
                    </div>

                    <MenuUsuario />

                </header>

                {carregando && <p>Carregando filme...</p>}

                {erro && <p>{erro}</p>}

                {!carregando && filme && (
                    <section className="detalhes-filme">

                        <div className="capa-filme">
                            {filme.imagemCapa ? (
                                <img
                                    src={filme.imagemCapa}
                                    alt={`Capa do filme ${filme.titulo}`}
                                />) : (
                                <p>Sem imagem</p>
                            )}
                        </div>

                        <div className="informacoes-filme">

                            <div className="titulo-generos">

                                <h1>{filme.titulo}</h1>

                                <div className="generos">
                                    {filme.idGenero.map((genero) => (
                                        <span key={genero.idGenero}>
                                            {genero.nome}
                                        </span>
                                    ))}
                                </div>

                            </div>

                            <p className="sinopse">
                                {filme.sinopse}
                            </p>

                            <a href="#" className="botao-rosa">
                                <i className="fa-solid fa-plus"></i>
                                Adicionar à minha lista
                            </a>

                            <div className="dados-filme">

                                <div>
                                    <p>Ano de lançamento</p>
                                    <h2>{filme.dataLancamento.substring(0, 4)}</h2>
                                </div>

                                <div>
                                    <p>Duração</p>
                                    <h2>{formatarDuracao(filme.duracao)}</h2>
                                </div>

                            </div>

                        </div>

                    </section>)}

            </main>

        </div>
    );
}

export default Detalhes;
