# Imagens de eventos com Cloudinary

O `EventoController` recebe `ArquivoImagem` como `multipart/form-data`. O serviço envia a imagem para a pasta `eventplus/eventos` no Cloudinary e grava somente a URL HTTPS em `Evento.ImagemUrl`. O endpoint de cadastro exige um token de autenticação.

## Configuração local

Na pasta `Backend/EventPlus.WebAPI`, configure as três credenciais com Secret Manager. Use os valores do painel da sua conta Cloudinary:

```powershell
dotnet user-secrets set "Cloudinary:CloudName" "SEU_CLOUD_NAME"
dotnet user-secrets set "Cloudinary:ApiKey" "SUA_API_KEY"
dotnet user-secrets set "Cloudinary:ApiSecret" "SEU_API_SECRET"
```

Em outros ambientes, defina `Cloudinary__CloudName`, `Cloudinary__ApiKey` e `Cloudinary__ApiSecret` como variáveis de ambiente. As chaves vazias em `appsettings.json` mostram a estrutura esperada; não coloque valores reais nesse arquivo nem os envie ao Git. A API verifica se as três chaves foram configuradas ao iniciar.

## Banco existente

Execute [`AtualizarImagemUrl.sql`](AtualizarImagemUrl.sql) no banco `EventPlus` antes de fazer uploads. O script amplia a coluna existente para `NVARCHAR(2048)` quando necessário e pode ser executado novamente. Para um banco criado do zero, `EventPlus_Scrip_BD.sql` já usa o novo tamanho.

## Requisição

Envie `Nome`, `Descricao`, `DataEvento` e, opcionalmente, `ArquivoImagem`, `ImagemUrl`, `IdTipoEvento` e `IdInstituicao` para `POST /api/Evento`. O método `eventoService.cadastrar` do frontend monta esse formulário. Quando há arquivo, ele tem prioridade sobre `ImagemUrl`. Formatos aceitos: JPG, PNG, WEBP e GIF, até 10 MB. O navegador deve definir o `Content-Type` e o boundary do `FormData` automaticamente.
