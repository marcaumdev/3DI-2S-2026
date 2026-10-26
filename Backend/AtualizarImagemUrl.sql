-- Execute uma vez no banco EventPlus existente. Não altera dados de eventos.
USE EventPlus;
GO

IF OBJECT_ID(N'dbo.Evento', N'U') IS NULL
    THROW 50001, 'A tabela dbo.Evento não existe.', 1;
GO

DECLARE @typeName sysname;
DECLARE @maxLength smallint;

SELECT @typeName = t.name, @maxLength = c.max_length
FROM sys.columns AS c
JOIN sys.types AS t ON t.user_type_id = c.user_type_id
WHERE c.object_id = OBJECT_ID(N'dbo.Evento') AND c.name = N'ImagemUrl';

IF @typeName IS NULL
    THROW 50002, 'A coluna dbo.Evento.ImagemUrl não existe.', 1;

IF @typeName NOT IN (N'varchar', N'nvarchar')
    THROW 50003, 'ImagemUrl não é varchar/nvarchar; revise a coluna antes de alterar.', 1;

-- max_length é medido em bytes: NVARCHAR(2048) ocupa 4096 bytes.
IF @maxLength <> -1 AND
   ((@typeName = N'varchar' AND @maxLength < 2048) OR
    (@typeName = N'nvarchar' AND @maxLength < 4096))
BEGIN
    ALTER TABLE dbo.Evento ALTER COLUMN ImagemUrl NVARCHAR(2048) NULL;
END;
GO
