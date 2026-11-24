import type { Genero } from "./genero";

export interface Filme {
    idFilme: number;
    titulo: string;
    sinopse: string;
    dataLancamento: string;
    duracao: number;
    imagemCapa: string;
    idGenero: Genero[]
}

export interface RespostaFilmes {
    items: Filme[];
    total: number;
    pagina: number;
    tamanhoPagina: number;
}
