CREATE DATABASE PlotDB;

USE PlotDB;

-- TABELA USUARIO
CREATE TABLE Usuario (
	IdUsuario	INT IDENTITY(1, 1)	PRIMARY KEY,
	Nome		VARCHAR(100)		NOT NULL,
	Email		VARCHAR(50)			NOT NULL UNIQUE,
	Senha		VARCHAR(255)		NOT NULL,
	TipoUsuario VARCHAR(20)			NOT NULL
		CHECK (TipoUsuario IN ('Admin', 'Usuario')),
	Ativo		BIT NOT NULL DEFAULT 1,
	FotoPerfil	VARCHAR(MAX)
);


-- TABELA FILME
CREATE TABLE FILME(
	IdFilme			INT IDENTITY(1,1) PRIMARY KEY,
	Titulo			VARCHAR(100) NOT NULL,
	Sinopse			VARCHAR(MAX) NOT NULL,
	DataLancamento	DATE NOT NULL 
		CHECK ( YEAR(DataLancamento) BETWEEN 1888 AND YEAR(GETDATE()) ),
	Duracao			INT NOT NULL 
		CHECK ( Duracao > 0),
	ImagemCapa		VARCHAR(MAX)
);

-- TABELA GENERO

CREATE TABLE Genero (
	IdGenero	INT IDENTITY(1,1) PRIMARY KEY,
	Nome		VARCHAR(50) NOT NULL UNIQUE
);


-- TABELA FILMEGENERO

CREATE TABLE FilmeGenero(
	IdFilme		INT NOT NULL,
	IdGenero	INT NOT NULL,

	CONSTRAINT PK_FilmeGenero		PRIMARY KEY(IdFilme, IdGenero),
	CONSTRAINT FK_FilmeFilmeGenero	
		FOREIGN KEY(IdFilme) REFERENCES Filme(IdFilme),
	CONSTRAINT FK_GeneroFilmeGenero 
		FOREIGN KEY(IdGenero) REFERENCES Genero(IdGenero)
);

-- TRIGGER: Exclusão de Usuário - SOFT DELETE

CREATE TRIGGER TR_UsuarioSoftDelete
ON Usuario
INSTEAD OF DELETE
AS
BEGIN
	UPDATE Usuario
	SET Ativo = 0
	WHERE IdUsuario IN 
		(SELECT IdUsuario FROM deleted) 
END;


INSERT INTO Usuario (Nome, Email, Senha, TipoUsuario)
VALUES
('Ana Silva', 'ana@email.com', 
	CONVERT(VARCHAR(255), HASHBYTES('SHA2_256', 'admin123'), 2),
	'Admin');

INSERT INTO Genero (Nome)
VALUES
('Terror'),
('Suspense'),
('Romance');

INSERT INTO Filme (Titulo, Sinopse, DataLancamento, Duracao, ImagemCapa)
VALUES
(	'Invocação do Mal', 
	'Invocação do Mal (2013), dirigido por James Wan, acompanha a família Perron 
	(formada por Roger, Carolyn e suas cinco filhas) após se 
	mudarem para uma antiga e isolada fazenda em Rhode Island, em 1971.',
	'20130913',
	112,
	'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQN-klo8zb4JR5gYg0Fgp1g5-g7jj9IfMNqTLUdd9uIbhXKGiSfnpBjfhM&s=10'
)

SELECT * FROM Filme
SELECT * FROM FilmeGenero

INSERT INTO FilmeGenero (IdFilme, IdGenero)
VALUES
(3, 1), -- Invocação do mal - terror
(3, 2)	-- Invocação do mal - suspense


SELECT f.Titulo, YEAR(f.DataLancamento) AS AnoLancamento, f.Duracao, g.Nome AS Genero
FROM Filme f
	JOIN FilmeGenero fg
		ON f.IdFilme = fg.IdFilme
	JOIN Genero g
		ON g.IdGenero = fg.IdGenero
ORDER BY f.Titulo;

SELECT * FROM Usuario

ALTER TABLE Usuario
ADD FotoPerfil	VARCHAR(MAX); -Force

DELETE FROM Usuario