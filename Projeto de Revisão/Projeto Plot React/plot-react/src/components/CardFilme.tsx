import { Link } from "react-router-dom";
import type { Filme } from "../types/filme";

// Define as propriedades que o componente deve receber
interface Props {
    filme: Filme;
}

function CardFilme({ filme } : Props) {
    return (
        <article className="filme">
            <Link to={`/detalhes/${filme.idFilme}`}>
                {filme.imagemCapa ? (
                    <img src={filme.imagemCapa} alt={filme.titulo} />
                ) : (
                    <div className="filme-sem-capa">Sem imagem</div>
                )}
            </Link>

            <h3>{filme.titulo}</h3>
            <p>{filme.dataLancamento.substring(0, 4)}</p>
        </article>
    );
}

export default CardFilme;

