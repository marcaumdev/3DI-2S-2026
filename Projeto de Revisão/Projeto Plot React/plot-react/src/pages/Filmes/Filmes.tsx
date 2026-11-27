
import { useEffect, useState } from "react";
import MenuLateral from "../../components/MenuLateral";
import MenuUsuario from "../../components/MenuUsuario";

import "./Filmes.css";
import type { Filme } from "../../types/filme";
import type { Genero } from "../../types/genero";
import { cadastrarFilme, editarFilme, excluirFilme, listarFilmes } from "../../api/filmes";
import { listarGeneros } from "../../api/generos";
import { obterUsuario } from "../../services/sessaoService";

function Filmes() {
    const [titulo, setTitulo] = useState("");
    const [sinopse, setSinopse] = useState("");
    const [dataLancamento, setDataLancamento] = useState("");
    const [duracao, setDuracao] = useState("");
    const [arquivoImagem, setArquivoImagem] = useState<File | null>(null);
    const [generosSelecionados, setGenerosSelecionados] = useState<number[]>([])
    const [idEdicao, setIdEdicao] = useState<number | null>(null);

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
                console.log(usuario)
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

    // Obtém os anos do filmes, remove duplicados e ordena do mais recente ao mais antigo
    const anos = [...new Set(
        // Percorre os filmes e extrai o ano de lançamento de cada um
        filmes.map((filme) => filme.dataLancamento.substring(0, 4))
    )].sort((a, b) => b.localeCompare(a)); // compara os anos colocando os mais recentes primeiro

    function limparFormulario() {
        setTitulo("");
        setSinopse("");
        setDataLancamento("");
        setDuracao("");
        setArquivoImagem(null);
        setGenerosSelecionados([])
        setIdEdicao(null)

        const campoPoster = document.getElementById("poster") as HTMLInputElement;

        if (campoPoster) {
            campoPoster.value = ""
        }
    }

    async function salvarFilme(evento: React.SubmitEvent<HTMLFormElement>) {
        evento.preventDefault();

        if (generosSelecionados.length === 0) {
            alert("Selecione pelo menos um gênero.")
            return;
        }

        const dados = new FormData();

        dados.append("Titulo", titulo);
        dados.append("Sinopse", sinopse);
        dados.append("DataLancamento", dataLancamento);
        dados.append("Duracao", duracao);

        if (arquivoImagem) {
            dados.append("ArquivoImagem", arquivoImagem);
        }

        generosSelecionados.forEach((id) => {
            dados.append("IdGeneros", id.toString());
        });

        try {

            // Verifica se estamos cadastrando ou editando um filme
            if (idEdicao === null) {
                await cadastrarFilme(dados);
                alert("Filme cadastrado com sucesso!");
            } else{
                await editarFilme(idEdicao, dados)
                alert("Filme atualizado com sucesso!")
            }

            // Atualiza a listagem de filmes
            const resposta = await listarFilmes(1, 100);
            setFilmes(resposta.items);

            limparFormulario();

        } catch (error) {
            console.error("Erro ao cadastrar filme:", error);
            alert("Não foi possível cadastrar o filme.")
        }
    }

    function selecionarFilme(filme: Filme) {

        //Armazena o identificador do filme selecionado
        setIdEdicao(filme.idFilme)

        // Preenche os campos do formulário
        setTitulo(filme.titulo);
        setSinopse(filme.sinopse);
        setDataLancamento(filme.dataLancamento.substring(0, 10));
        setDuracao(String(filme.duracao))

        // Limpa a imagem selecionada anteriormente
        setArquivoImagem(null);

        // Recupera os gêneros associados ao filme
        setGenerosSelecionados(
            filme.idGenero.map(genero => genero.idGenero)
        );

        // Limpa o campo de seleção de imagem
        const campoPoster = document.getElementById("poster") as HTMLInputElement;

        if (campoPoster) {
            campoPoster.value = "";
        }

        //Retorna ao início da página para visualizar o formulário
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    async function removerFilme(id: number){
        // Solicita a confirmação antes de excluir o filme
        const confirmar = window.confirm(
            "Deseja realmente excluir este filme?"
        )

        // Se o usuário cancelar, interrompe a função
        if(!confirmar) return;

        try{
            // Envia a requisição de exclusão para API
            await excluirFilme(id);

            // Atualiza a listagem após a exclusão
            const resposta = await listarFilmes(1, 100);
            setFilmes(resposta.items);

            // Limpa o formulário se o filme excluído estiver em edição
            if(idEdicao === id){
                limparFormulario();
            }
            alert("Filme excluído com sucesso")
        } catch(error) {
            console.error("Erro ao excluir filme:", error);
            alert("Não foi possível excluir o filme");
        }
    }

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

                {ehAdmin && (
                    <section className="secao-filmes">

                        <h2>Cadastrar / Editar Filme</h2>

                        <form className="formulario-filme" onSubmit={salvarFilme}>

                            <div className="coluna-formulario">

                                <div className="campo-formulario">
                                    <label htmlFor="titulo">Título</label>
                                    <input
                                        type="text"
                                        id="titulo"
                                        name="titulo"
                                        placeholder="Digite o título do filme"
                                        value={titulo}
                                        onChange={(e) => setTitulo(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="campo-formulario">
                                    <label htmlFor="data">Data de lançamento</label>
                                    <input
                                        type="date"
                                        id="data"
                                        name="data"
                                        value={dataLancamento}
                                        onChange={(e) => setDataLancamento(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="campo-formulario">
                                    <label htmlFor="sinopse">Sinopse</label>
                                    <textarea
                                        id="sinopse"
                                        name="sinopse"
                                        placeholder="Digite a sinopse ou descrição do filme"
                                        value={sinopse}
                                        onChange={(e) => setSinopse(e.target.value)}
                                        required
                                    />
                                </div>

                            </div>

                            <div className="coluna-formulario">

                                <div className="campo-formulario">
                                    <label htmlFor="poster">Pôster</label>

                                    <label htmlFor="poster" className="campo-arquivo">
                                        <i className="fa-solid fa-download"></i>
                                        <span>
                                            {arquivoImagem
                                                ? arquivoImagem.name
                                                : "Selecione o arquivo desejado"
                                            }
                                        </span>
                                    </label>

                                    <input
                                        type="file"
                                        id="poster"
                                        name="poster"
                                        accept="image/*"
                                        hidden
                                        onChange={(e) => setArquivoImagem(
                                            e.target.files?.[0] || null
                                        )}
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
                                        value={duracao}
                                        onChange={(e) => setDuracao(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="campo-formulario">
                                    <label htmlFor="generos">Gênero</label>

                                    <select
                                        id="generos"
                                        onChange={(e) => {
                                            const id = Number(e.target.value)

                                            if (!generosSelecionados.includes(id)) {
                                                setGenerosSelecionados(
                                                    [...generosSelecionados, id]
                                                );
                                            }
                                        }}
                                    >
                                        <option value="" disabled>
                                            Selecione o(s) gênero(s)
                                        </option>
                                        {generos.map((genero) => (
                                            <option
                                                key={genero.idGenero}
                                                value={genero.idGenero}
                                            >
                                                {genero.nome}
                                            </option>
                                        ))}
                                    </select>

                                    <div className="generos-selecionados">
                                        {generosSelecionados.map((id) => {
                                            const genero = generos.find((g) => g.idGenero === id)

                                            return (
                                                <button
                                                    key={id}
                                                    type="button"
                                                    className="genero-selecionado"
                                                    onClick={() =>
                                                        setGenerosSelecionados(
                                                            generosSelecionados.filter((g) => g !== id)
                                                        )
                                                    }
                                                >
                                                    {genero?.nome}
                                                    <i className="fa-solid fa-xmark"></i>
                                                </button>
                                            )
                                        })}
                                    </div>

                                    <a href="#" className="adicionar-genero">
                                        + Adicione um gênero
                                    </a>
                                </div>

                                <div className="botoes-formulario">
                                    <button
                                        type="reset"
                                        className="botao-limpar"
                                        onClick={limparFormulario}
                                    >
                                        Limpar
                                    </button>

                                    <button type="submit" className="botao-salvar">
                                        <i className="fa-solid fa-floppy-disk"></i>
                                        Salvar Filme
                                    </button>
                                </div>

                            </div>

                        </form>

                    </section>)}

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

                            <select
                                id="ano"
                                value={ano}
                                onChange={(e) => setAno(e.target.value)}
                            >
                                <option value="">Todos</option>

                                {anos.map((anoFilme) => (
                                    <option key={anoFilme} value={anoFilme}>
                                        {anoFilme}
                                    </option>
                                ))}

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
                                                    onClick={
                                                        () => selecionarFilme(filme)
                                                    }
                                                >
                                                    <i className="fa-regular fa-pen-to-square"></i>
                                                </button>

                                                <button
                                                    type="button"
                                                    className="botao-acao"
                                                    title="Excluir"
                                                    onClick={ 
                                                    () => removerFilme(filme.idFilme)
                                                    }
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
