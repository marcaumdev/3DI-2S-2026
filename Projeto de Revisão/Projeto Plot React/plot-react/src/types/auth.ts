// resposta que recebemos da API
// A interface define o formato esperado da resposta
// os nomes precisam ser iguais aos do JSON retornado da API

import type { usuario } from "./usuario";

export interface RespostaLogin {
    token: string;
    expiracaoUtc: string;
    usuario: usuario
}
