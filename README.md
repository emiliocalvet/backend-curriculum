## Descrição

Backend para gerenciamento de curriculos feito com NestJs + MongoDB

## Instalação

Para baixar todas as dependências, execute o seguinte comando na raiz do projeto.

```bash
$ npm install
```

## Executar

Primeiramente é necessário criar o arquivo .env na pasta raiz do projeto com 2 variáveis.

String de conexão com banco mongo.
ex: MONGO_URL=mongodb+srv://usuario:senha@endereço-banco-dados/nome-tabela?retryWrites=true&w=majority

String segredo para autenticação.
ex: JWT_SECRET=zW@37wEr$Y542Ui@oa67Q$rs

Depois de configurado arquivo .env basta rodar:

```bash
# Desenvolvimeto
$ npm run start

# Modo Assistido
$ npm run start:dev

# Modo Produção
$ npm run start:prod
```

## Sobre

- Author - [Emilio Calvet](https://emiliocalvet.github.io)
- Licença - [MIT licensed](LICENSE).
