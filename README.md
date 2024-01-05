# Seu Projeto Angular

Este repositório é uma prova de conceito (POC) desenvolvida em Angular 2+, utilizando a biblioteca de componentes Material. O projeto incorpora funcionalidades de autenticação na tela de login com Firebase e um chat utilizando a API GPT do OpenAI.

## Configurações Necessárias

### Clonar o Projeto

1. **Clone o repositório:**
   - `git clone https://github.com/seu-usuario/seu-repositorio.git`

2. **Navegue até o diretório do projeto:**
   - `cd seu-repositorio`

3. **Faça checkout para a branch `develop`:**
   - `git checkout develop`

4. **Instale as dependências:**
   - `npm install`

### Configurar o Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/).

2. Adicione um novo projeto ou selecione um projeto existente.

3. No arquivo `src/environments/environment.ts`, substitua as configurações do Firebase pelos dados do seu projeto Firebase.

### Configurar o Chat GPT, realize a etapa abaixo apenas se tiver problema ao utilizar o Chat AI GPT ou problemas ao fazer login

1. Obtenha uma chave API no [Chat do OpenAI](https://platform.openai.com/api-keys).

2. Substitua a chave no arquivo `src/environments/environment.ts`.
   - Deve ficar assim:
   ```typescript
   export const environment = {
     env_name: 'dev',
     production: false,
     firebase: {
       apiKey: "CHAVE API KEY",
       authDomain: "project-nome-codigo.firebaseapp.com",
       projectId: "project-nome-codigo",
       storageBucket: "project-nome-codigo.appspot.com",
       messagingSenderId: "codigo-id",
       appId: "app-ID",
       measurementId: "G-codigo-id"
     },
     apiKeyGpt: 'API-KEY-GPT',
   };

## Executar o Projeto

Após configurar o projeto, você pode iniciar o servidor localmente:

- `ng serve`

O projeto estará disponível em [http://localhost:4200/](http://localhost:4200/).

---
