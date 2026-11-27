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

    // O valor 0 irá representar a opção Todos, ou nenhum filtro aplicado
    const [generoSelecionado, setGeneroSelecionado] = useState(0);
    const [filmeDestaque, setFilmeDestaque] = useState<Filme | null>(null);

    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState("");

    const [busca, setBusca] = useState("");

    // Filtra os filmes de acordo com gênero selecionado
    const filmesFiltrados = filmes.filter((filme) => {

        // Se nenhum gênero específico estiver selecionado, exibe todos os filmes
        if (generoSelecionado === 0) {
            return true;
        }

        // Verifica se o filme possui o gênero selecionado
        return filme.idGenero.some(
            // Verifica se o ID do gênero do filme corresponde ao gênero selecionado
            (genero) => genero.idGenero === generoSelecionado
        )
    })

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

    useEffect(() => {

        async function carregarDestaque() {
            try {
                const resposta = await listarFilmes(1, 100);
                setFilmeDestaque(resposta.items[0] ?? null) // resposta.items[0] seleciona o primeiro filme retornado
            } catch (erro) {
                console.error("Erro ao carregar filme em destaque:", erro)
            }
        }

        carregarDestaque();
    }, [])


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

                    <MenuUsuario />
                </header>

                <section
                    className="filme-destaque"
                    style={{
                        backgroundImage: filmeDestaque?.imagemCapa
                            ? `linear-gradient(to right, #040311 10%, transparent 100%), url("${filmeDestaque.imagemCapa}")`
                            : "none",
                        backgroundSize: "cover",
                        backgroundPosition: "center"
                    }}
                >
                    {filmeDestaque &&
                        <div className="informacoes-destaque">
                            <p className="generos-destaque">
                                {/* Percorre os gêneros associados ao filme em destaque */}
                                {filmeDestaque.idGenero.map((genero, index) => (
                                    <span key={genero.idGenero}>
                                        {/* Adiciona um separador antes do gênero, exceto o primeiro */}
                                        {index > 0 && " • "}
                                        {genero.nome}
                                    </span>
                                ))}
                                <span> • </span>
                                {filmeDestaque.dataLancamento.substring(0, 4)}
                            </p>

                            <h1>{filmeDestaque.titulo}</h1>

                            <p className="sinopse">
                                {filmeDestaque.sinopse}
                            </p>

                            <div className="botoes-destaque">
                                <Link to={`/detalhes/${filmeDestaque.idFilme}`} className="botao-rosa">
                                    <i className="fa-solid fa-play"></i>
                                    Ver detalhes
                                </Link>

                                <button type="button" className="botao-escuro">
                                    <i className="fa-solid fa-plus"></i>
                                    Adicionar à minha lista
                                </button>
                            </div>
                        </div>}
                </section>

                <section className="filtro-generos">
                    <h2>Gêneros</h2>
                    {/* Botão que seleciona todos os gêneros e aplica a classe CSS quando estiver selecionado */}
                    <button
                        className={generoSelecionado === 0 ? "selecionado" : ""}
                        type="button"
                        onClick={() => setGeneroSelecionado(0)}
                    >
                        <i className="fa-solid fa-border-all"></i> Todos
                    </button>

                    {/* Percorre a lista de gêneros e cria um botão pra cada gênero */}
                    {generos.map((genero) => (
                        <button
                            // Identifica cada botão com o ID único do gênero
                            key={genero.idGenero}
                            type="button"
                            // Aplica a classe CSS "selecionado" ao gênero selecionado
                            className={generoSelecionado === genero.idGenero ? "selecionado" : ""}

                            // Atualiza o estado com o ID do gênero clicado
                            onClick={() => setGeneroSelecionado(genero.idGenero)}
                        >
                            {genero.nome}
                        </button>
                    ))}
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
                        {!carregando && !erro && filmesFiltrados.length === 0 &&
                            (<p>Nenhum filme encontrado.</p>)}

                        {!carregando && !erro && filmesFiltrados.slice(0, 6).map((filme) => (
                            <CardFilme key={filme.idFilme} filme={filme} />
                        ))}

                    </div>
                </section>

                {generos.map((genero) => {

                    // Se um gênero diferente de TODOS estiver selecionado e não for o gênero atual, ele não é exibido
                    if (generoSelecionado !== 0 && generoSelecionado !== genero.idGenero) {
                        return null
                    }

                    // Verifica se o filme possui o gênero atual
                    const filmesDoGenero = filmesFiltrados.filter((filme) =>
                        filme.idGenero.some((g) => g.idGenero === genero.idGenero)
                    );

                    if (filmesDoGenero.length === 0) {
                        return null;
                    }

                    return (
                        <section className="secao-filme" key={genero.idGenero}>
                            <div className="titulo-secao">
                                <h2>{genero.nome}</h2>

                                <Link to="/filmes">
                                    Ver todos <i className="fa-solid fa-arrow-right"></i>
                                </Link>
                            </div>


                            <div className="lista-horizontal">
                                {
                                    filmesDoGenero.map((filme) => (
                                        <article
                                            className="filme-horizontal"
                                            key={filme.idFilme}
                                            style={{
                                                backgroundImage: filme.imagemCapa
                                                    ? `url("${filme.imagemCapa}")`
                                                    : "none",
                                                backgroundColor: "var(--campo)"
                                            }}
                                        >
                                            <div>
                                                <h3>{filme.titulo}</h3>
                                                <small>{filme.dataLancamento.substring(0, 4)}</small>
                                            </div>

                                            <Link to={`/detalhes/${filme.idFilme}`}>
                                                <i className="fa-solid fa-chevron-right"></i>
                                            </Link>
                                        </article>
                                    ))
                                }
                            </div>
                        </section>
                    )
                })}

            </main>
        </div>
    );
}

export default Home;
