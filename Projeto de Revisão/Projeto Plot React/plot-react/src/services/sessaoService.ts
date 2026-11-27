import type { RespostaLogin } from "../types/auth";

// função de salvar a sessão do usuário
export function salvarSessao(dados: RespostaLogin) {

    // sessionStorage: armazena informações durante a sessão da aba do navegador
    // setItem(): salva uma informação (ex: token: aksdgashdjksahkjk)
    sessionStorage.setItem("token", dados.token);
    
    // cria a chave(variável) usuario e cria um json para transformar o objeto USUARIO recebido pela API em um texto JSON
    // vai ficar mais ou menos assim na sessão:
    // usuario: {
    //      nome: "Usuario",
    //      email: "email@email.com",
    //      tipoUsuario: "Admin"
    //}
    sessionStorage.setItem("usuario", JSON.stringify({ 
        nome: dados.usuario.nome,
        email: dados.usuario.email,
        tipoUsuario: dados.usuario.tipoUsuario
    }));

    sessionStorage.setItem("expiracaoUtc", dados.expiracaoUtc);
}

export function obterToken() {
    // getItem(): recupera uma informação
    // aqui nessa função retornamos o token
    return sessionStorage.getItem("token");
}

export function obterUsuario() {
    const usuario = sessionStorage.getItem("usuario");

    // JSON.parse(): transforma o texto JSON novamente em objeto
    // aqui nessa função validamos se o usuário existe
    // se existir: retorna o objeto com as informações do usuário
    // se não: retorna null
    return usuario ? JSON.parse(usuario) : null;
}

// Limpando a sessão do navegador
export function encerrarSessao() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("usuario");
    sessionStorage.removeItem("expiracaoUtc");
}

export function sessaoValida() {

    const token = obterToken();
    const expiracaoUtc = sessionStorage.getItem("expiracaoUtc");

    // se não existir um token (!token) ou data de expiração (!expiracaoUtc), retorna false
    if(!token || !expiracaoUtc) {
        return false;
    }

    // Verifica se a data de expiração é maior que a data atual
    // retorna true se o token ainda estiver dentro do prazo de validade
    // e false se estiver expirado
    return new Date(expiracaoUtc).getTime() > Date.now();
}