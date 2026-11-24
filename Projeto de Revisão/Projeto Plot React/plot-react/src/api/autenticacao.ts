import type { RespostaLogin } from "../types/auth";
import { api } from "./api";

export async function fazerLogin(email: string, senha: string) : Promise<RespostaLogin> {

    const resposta = await api.post("Login", { // await: aguarda a resposta da API
        email,
        senha
    })

    return resposta.data; // resposta.data: contém os dados retornados pelo servidor.
}


