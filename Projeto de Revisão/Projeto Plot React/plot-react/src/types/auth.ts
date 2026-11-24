// resposta que recebemos da API
// A interface define o formato esperado da resposta
// os nomes precisam ser iguais aos do JSON retornado da API

export interface RespostaLogin {
    token: string;
    nome: string;
    email: string;
    tipoUsuario: string;
    expiracaoUtc: string;
}