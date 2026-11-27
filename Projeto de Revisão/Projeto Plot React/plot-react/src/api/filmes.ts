import type { Filme, RespostaFilmes } from "../types/filme";
import { api } from "./api";

export async function listarFilmes(
    pagina: number = 1,
    tamanhoPagina: number = 10,
    busca: string = ""
) : Promise<RespostaFilmes> {

    // Realiza uma requisição GET na API e aguarada a resposta com os dados dos filmes
    const resposta = await api.get<RespostaFilmes>("Filme", {

        // define os parametros de consulta enviados na URL
        // params: propriedade do axios que permite o envio de parametros na URL
        // exemplo:
        // "https://localhost:7235/api/Filme?pagina=1&tamanhoPagina=10&busca=Batman"
        params: {
            pagina,         // número da página que será consultada
            tamanhoPagina,  // quantidade de filmes por página
            busca           // termo utilizado para pesquisar os filmes
        }

    })

    return resposta.data;
}

// Busca um filme específico pelo ID
export async function buscarFilmeId(id: number): Promise<Filme>{
    const resposta = await api.get<Filme>(`Filme/${id}`)

    return resposta.data;
}
