
import { useEffect, useState } from "react";
import MenuLateral from "../../components/MenuLateral";
import MenuUsuario from "../../components/MenuUsuario";

import "./Filmes.css";
import type { Filme } from "../../types/filme";
import type { Genero } from "../../types/genero";
import { listarFilmes } from "../../api/filmes";
import { listarGeneros } from "../../api/generos";
import { obterUsuario } from "../../services/sessaoService";

function Filmes() {
    const [filmes, setFilmes] = useState<Filme[]>([])
    const [generos, setGeneros] = useState<Genero[]>([])

    const [busca, setBusca] = useState("");
    const [ano, setAno] = useState("");

    const usuario = obterUsuario();

    const ehAdmin = usuario?.tipoUsuario === "Admin"

    useEffect(() => {
        async function carregarDados() {
            try {
                const respostaFilmes = await listarFilmes(1, 100);
                const respostaGeneros = await listarGeneros();

                setFilmes(respostaFilmes.items);
                setGeneros(respostaGeneros);
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            }
        }

        carregarDados();
    }, [])

    // Converte a data do formato AAAA-MM-DD para DD/MM/AAAA
    function formatarData(data: string) {
        // Extrai os 10 primeiros caracteres da data e separa ano, mês e dia
        const partes = data.substring(0, 10).split("-");

        // Retorna a data no formato brasileiro (dia/mês/ano)
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

    function formatarDuracao(minutos: number) {
        const horas = Math.floor(minutos / 60);
        const minutosRestantes = minutos % 60;

        return `${horas}h ${minutosRestantes}min`
    }

    // Filtra os filmes de acordo com o título e o ano pesquisados
    const filmesFiltrados = filmes.filter((filme) => {

        // Verifica se o título do filme contém o texto pesquisado, ignora maiúsculas e minúsculas
        const correspondeTitulo = filme.titulo
            .toLowerCase()
            .includes(busca.toLowerCase())

        // Verifica se nenhum ano foi selecionado ou se o ano do filme corresponde ao pesquisada
        // || permite que o ano esteja vazio ou corresponda ao ano do filme
        const correspondeAno =
            ano === "" || filme.dataLancamento.substring(0, 4) === ano;

        // Retorna apenas os filmes que atendem os dois filtros
        return correspondeTitulo && correspondeAno;

    })

    return (
        <div className="layout-principal">

            <MenuLateral />

            <main className="conteudo-principal pagina-filmes">

                <header className="cabecalho">

                    <div className="titulo-pagina">
                        <h1>Filmes</h1>
                        <p>Cadastre, edite ou remova os filmes do sistema.</p>
                    </div>

                    <MenuUsuario />

                </header>

                {/* CADASTRAR / EDITAR FILME */}

                <section className="secao-filmes">

                    <h2>Cadastrar / Editar Filme</h2>

                    <form className="formulario-filme">

                        <div className="coluna-formulario">

                            <div className="campo-formulario">
                                <label htmlFor="titulo">Título</label>
                                <input
                                    type="text"
                                    id="titulo"
                                    name="titulo"
                                    placeholder="Digite o título do filme"
                                    required
                                />
                            </div>

                            <div className="campo-formulario">
                                <label htmlFor="data">Data de lançamento</label>
                                <input
                                    type="date"
                                    id="data"
                                    name="data"
                                    required
                                />
                            </div>

                            <div className="campo-formulario">
                                <label htmlFor="sinopse">Sinopse</label>
                                <textarea
                                    id="sinopse"
                                    name="sinopse"
                                    placeholder="Digite a sinopse ou descrição do filme"
                                    required
                                />
                            </div>

                        </div>

                        <div className="coluna-formulario">

                            <div className="campo-formulario">
                                <label htmlFor="poster">Pôster</label>

                                <label htmlFor="poster" className="campo-arquivo">
                                    <i className="fa-solid fa-download"></i>
                                    <span>Selecione o arquivo desejado</span>
                                </label>

                                <input
                                    type="file"
                                    id="poster"
                                    name="poster"
                                    accept="image/*"
                                    hidden
                                />
                            </div>

                            <div className="campo-formulario">
                                <label htmlFor="duracao">Duração</label>
                                <input
                                    type="number"
                                    id="duracao"
                                    name="duracao"
                                    min="1"
                                    placeholder="Digite a duração em minutos"
                                    required
                                />
                            </div>

                            <div className="campo-formulario">
                                <label htmlFor="generos">Gênero</label>

                                <select id="generos" defaultValue="">
                                    <option value="" disabled>
                                        Selecione o(s) gênero(s)
                                    </option>
                                    <option value="1">Ação</option>
                                    <option value="2">Aventura</option>
                                    <option value="3">Comédia</option>
                                    <option value="4">Drama</option>
                                    <option value="5">Ficção Científica</option>
                                </select>

                                <div className="generos-selecionados">
                                    <button type="button" className="genero-selecionado">
                                        Aventura
                                        <i className="fa-solid fa-xmark"></i>
                                    </button>
                                </div>

                                <a href="#" className="adicionar-genero">
                                    + Adicione um gênero
                                </a>
                            </div>

                            <div className="botoes-formulario">
                                <button type="reset" className="botao-limpar">
                                    Limpar
                                </button>

                                <button type="button" className="botao-salvar">
                                    <i className="fa-solid fa-floppy-disk"></i>
                                    Salvar Filme
                                </button>
                            </div>

                        </div>

                    </form>

                </section>

                {/* FILMES CADASTRADOS */}

                <section className="secao-filmes filmes-cadastrados">

                    <h2>Filmes Cadastrados</h2>

                    <div className="filtros-filmes">

                        <div className="pesquisa-filme">
                            <i className="fa-solid fa-magnifying-glass"></i>
                            <input
                                type="search"
                                id="pesquisa-filme"
                                placeholder="Buscar por título"
                                value={busca}
                                onChange={(e) => setBusca(e.target.value)}
                            />
                        </div>

                        <div className="filtro-ano">
                            <label htmlFor="ano">Ano de lançamento</label>

                            <select id="ano">
                                <option value="">Todos</option>
                                <option value="2024">2024</option>
                                <option value="2023">2023</option>
                                <option value="2022">2022</option>
                            </select>
                        </div>

                    </div>

                    <div className="tabela-filmes">
                        <table>
                            <thead>
                                <tr>
                                    <th>Título</th>
                                    <th>Data de lançamento</th>
                                    <th>Gênero(s)</th>
                                    <th>Duração</th>
                                    {ehAdmin && <th>Ações</th>}
                                </tr>
                            </thead>

                            <tbody>
                                {filmesFiltrados.map((filme) => (
                                    <tr key={filme.idFilme}>
                                        <td>{filme.titulo}</td>
                                        <td>{formatarData(filme.dataLancamento)}</td>
                                        <td>
                                            {filme.idGenero
                                                .map((genero) => genero.nome)
                                                .join(", ")}
                                        </td>
                                        <td>{formatarDuracao(filme.duracao)}</td>
                                        {ehAdmin && (
                                            <td className="acoes">
                                                <button
                                                    type="button"
                                                    className="botao-acao"
                                                    title="Editar"
                                                >
                                                    <i className="fa-regular fa-open-to-square"></i>
                                                </button>

                                                <button
                                                    type="button"
                                                    className="botao-acao"
                                                    title="Excluir"
                                                >
                                                    <i className="fa-regular fa-trash-can"></i>
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))

                                }
                            </tbody>
                        </table>
                    </div>

                </section>

            </main>
        </div>
    );
}

export default Filmes;
