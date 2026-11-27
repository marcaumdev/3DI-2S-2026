export interface usuario {
    idUsuario: number;
    nome: string;
    email: string;
    tipoUsuario: "Admin" | "Usuario";
    ativo: boolean;
    fotoPerfil: string | null
}