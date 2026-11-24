import { Link } from "react-router-dom";
import "./Home.css";

import MenuLateral from "../../components/MenuLateral";
import MenuUsuario from "../../components/MenuUsuario";
import { useEffect, useState } from "react";
import type { Filme } from "../../types/filme";
import type { Genero } from "../../types/genero";
import { listarFilmes } from "../../api/filmes";
import { listarGeneros } from "../../api/generos";
import CardFilme from "../../components/CardFilme";

function Home() {

    const [filmes, setFilmes] = useState<Filme[]>([])
    const [generos, setGeneros] = useState<Genero[]>([])

    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState("");

    const [busca, setBusca] = useState("");

    // executa a consulta na API quando o componente é montado
    // controla quando a consulta acontece, evitando novas requisições a cada renderização
    useEffect(() => {

        async function carregarFilmes() {
            
            setCarregando(true);
            setErro("");

            try {
                const resposta = await listarFilmes(1, 100, busca);
                setFilmes(resposta.items);
            } catch (erro) {
                console.error("Erro ao carregar filmes: ", erro);
                setErro("Não foi possível carregar os filmes.");
            } finally {
                setCarregando(false);
            }
        }

        // Executa a função responsável por carregar filmes.
        carregarFilmes();
    }, [busca]); // array vazio: executa o efeito na montagem do componente

    useEffect(() => {

        async function carregarGeneros() {

            try {
                const resposta = await listarGeneros();
                setGeneros(resposta);
            } catch (erro) {
                console.error("Erro ao carregar gêneros: ", erro)
            }

        }

        carregarGeneros();

    }, []);
     

    return (
        <div className="layout-principal">

            <MenuLateral />

            <main className="conteudo-principal">
                <header className="cabecalho">
                    <div className="campo-pesquisa">
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input 
                            type="search" 
                            placeholder="Buscar filmes, gêneros, atores..." 
                            value={busca} onChange={(evento) => setBusca(evento.target.value)} 
                        />
                    </div>

                    <MenuUsuario/>
                </header>

                <section
                    className="filme-destaque"
                    // style={{
                    //     backgroundImage: `linear-gradient(to right, #040311 10%, transparent 100%), url("${bannerDuna}")`,
                    //     backgroundSize: "cover",
                    //     backgroundPosition: "center"
                    // }}
                >
                    <div className="informacoes-destaque">
                        <p className="generos-destaque">
                            Ficção Científica <span>•</span> Aventura <span>•</span> 2024
                        </p>

                        <h1>DUNA</h1>

                        <p className="sinopse">
                            Em um futuro distante, Paul Atreides se junta
                            a um povo nômade em um planeta desértico para
                            evitar a destruição de sua família e de seu povo.
                        </p>

                        <div className="botoes-destaque">
                            <Link to="/detalhes" className="botao-rosa">
                                <i className="fa-solid fa-play"></i>
                                Ver detalhes
                            </Link>

                            <button type="button" className="botao-escuro">
                                <i className="fa-solid fa-plus"></i>
                                Adicionar à minha lista
                            </button>
                        </div>
                    </div>
                </section>

                <section className="filtro-generos">
                    <h2>Gêneros</h2>
                    <button className="selecionado" type="button">
                        <i className="fa-solid fa-border-all"></i> Todos
                    </button>
                    <button type="button">Ação</button>
                    <button type="button">Aventura</button>
                    <button type="button">Comédia</button>
                    <button type="button">Drama</button>
                    <button type="button">Ficção Científica</button>
                    <button type="button">Romance</button>
                    <button type="button">Suspense</button>
                    <button type="button">Terror</button>
                    <button type="button">Animação</button>
                </section>

                <section className="secao-filmes">
                    <div className="titulo-secao">
                        <h2>Adicionados recentemente</h2>
                        <Link to="/filmes">
                            Ver todos <i className="fa-solid fa-arrow-right"></i>
                        </Link>
                    </div>

                    <div className="lista-recentes">
                        {carregando && <p>Carregando filmes...</p>}
                        {erro && <p>{erro}</p>}

                        {/* Exibe uma mensagem cas não existam filmes cadastrados */}
                        {!carregando && !erro && filmes.length === 0 && 
                            (<p>Nenhum filme encontrado.</p>)}

                        {!carregando && !erro && filmes.slice(0, 6).map((filme) => (
                            <CardFilme key={filme.idFilme} filme={filme}/>
                        ))}

                    </div>
                </section>

                <section className="secao-filmes">
                    <div className="titulo-secao">
                        <h2>Terror</h2>
                        <Link to="/filmes">
                            Ver todos <i className="fa-solid fa-arrow-right"></i>
                        </Link>
                    </div>

                    <div className="lista-horizontal">
                        <article className="filme-horizontal it">
                            <div>
                                <h3>IT</h3>
                                <p>A COISA</p>
                                <small>2017</small>
                            </div>
                            <Link to="/detalhes">
                                <i className="fa-solid fa-chevron-right"></i>
                            </Link>
                        </article>

                        <article className="filme-horizontal freira">
                            <div>
                                <h3>A FREIRA</h3>
                                <small>2018</small>
                            </div>
                            <Link to="/detalhes">
                                <i className="fa-solid fa-chevron-right"></i>
                            </Link>
                        </article>

                        <article className="filme-horizontal sobrenatural">
                            <div>
                                <h3>SOBRENATURAL</h3>
                                <p>A PORTA VERMELHA</p>
                                <small>2023</small>
                            </div>
                            <Link to="/detalhes">
                                <i className="fa-solid fa-chevron-right"></i>
                            </Link>
                        </article>
                    </div>
                </section>

                <section className="secao-filmes">
                    <div className="titulo-secao">
                        <h2>Suspense</h2>
                        <Link to="/filmes">
                            Ver todos <i className="fa-solid fa-arrow-right"></i>
                        </Link>
                    </div>

                    <div className="lista-horizontal lista-suspense">
                        <article className="filme-horizontal noite">
                            <div>
                                <h3>A NOITE SEM FIM</h3>
                                <small>1984</small>
                            </div>
                            <Link to="/detalhes">
                                <i className="fa-solid fa-chevron-right"></i>
                            </Link>
                        </article>

                        <article className="filme-horizontal floresta">
                            <div>
                                <h3>FLORESTA SOMBRIA</h3>
                                <small>2020</small>
                            </div>
                            <Link to="/detalhes">
                                <i className="fa-solid fa-chevron-right"></i>
                            </Link>
                        </article>

                        <article className="filme-horizontal sussurros">
                            <div>
                                <h3>SUSSURROS</h3>
                                <small>2023</small>
                            </div>
                            <Link to="/detalhes">
                                <i className="fa-solid fa-chevron-right"></i>
                            </Link>
                        </article>

                        <article className="filme-horizontal sombras">
                            <div>
                                <h3>SOMBRAS NA CIDADE</h3>
                                <small>2024</small>
                            </div>
                            <Link to="/detalhes">
                                <i className="fa-solid fa-chevron-right"></i>
                            </Link>
                        </article>

                        <article className="filme-horizontal nevoa">
                            <div>
                                <h3>NÉVOA SILENCIOSA</h3>
                                <small>2025</small>
                            </div>
                            <Link to="/detalhes">
                                <i className="fa-solid fa-chevron-right"></i>
                            </Link>
                        </article>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Home;
