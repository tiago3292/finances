<a id="readme-top"></a>

<!-- LOGO DO PROJETO -->
<br />
<div align="center">
  <a href="https://github.com/github_username/repo_name">
    <img src="logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Finances</h3>

  <p align="center">
    App de finanças completo com autenticação de usuário
  </p>
</div>

<!-- TABELA DE CONTEÚDO -->
<details>
  <summary>Tabela de conteúdo</summary>
  <ol>
    <li>
      <a href="#sobre-o-projeto">Sobre o projeto</a>
      <ul>
        <li><a href="#funcionalidades">Funcionalidades</a></li>
        <li><a href="#feito-com">Tecnologias Usadas</a></li>
        <li><a href="#estrutura">Estrutura do projeto</a></li>
      </ul>
    </li>
    <li>
      <a href="#comece-aqui">Comece aqui</a>
      <ul>
        <li><a href="#prerequisitos">Pré-requisitos</a></li>
        <li><a href="#instalacao">Instalação</a></li>
      </ul>
    </li>
    <li><a href="#uso">Uso</a></li>
    <li><a href="#conceitos">Conceitos usados</a></li>
  </ol>
</details>

<!-- SOBRE O PROJETO -->
# <a id="sobre-o-projeto">Sobre o projeto</a>

![Product Name Screen Shot][product-screenshot]

Aplicativo de finanças pessoais. Registre seus gastos e ganhos para ter um controle organizado da sua renda. Desenvolvido como o sétimo projeto de um desafio de desenvolvimento de 12 meses, com foco em conceitos avançados de React e Python.

### Funcionalidades
<a id="funcionalidades"></a>
* Criação de contas e autenticação por token
* Rotas protegidas
* Dashboard com resumos, gráficos e itens com maiores valores
* Rota para criação, edição e exclusão de gastos e ganhos
* Tabelas com todos os gastos e ganhos registrados
* Função de filtro por categoria, data inicial e data final
* Upload de imagem para cara item cadastrado

<p align="right">(<a href="#topo">Voltar ao topo</a>)</p>

# Tecnologias usadas
<a id="feito-com"></a>

* [![Python][Python]][Python-url]
* [![PostgreSQL][PostgreSQL]][PostgreSQL-url]
* [![React][React.js]][React-url]
* [![TailwindCSS][TailwindCSS]][TailwindCSS-url]
* [![JavaScript][JavaScript]][JavaScript-url]

<p align="right">(<a href="#topo">Voltar ao topo</a>)</p>

# <a id="estrutura">Estrutura do projeto</a>


Estrutura do backend:
```
backend/
├── alembic/
│   ├── versions/
│   └── env.py
├── alembic.ini
├── app/
│   ├── init.py
│   ├── main.py                 # cria a app FastAPI, inclui routers, CORS
│   ├── core/
│   │   ├── config.py            # settings (Pydantic BaseSettings) — env vars
│   │   └── security.py          # hash de senha, criação/validação de JWT
│   ├── db/
│   │   ├── base.py               # Base declarativa do SQLAlchemy
│   │   ├── session.py            # engine, SessionLocal, get_db()
│   ├── models/
│   │   ├── user.py
│   │   └── item.py
│   ├── schemas/                  # Pydantic models (request/response)
│   │   ├── user.py
│   │   ├── item.py
│   │   └── token.py
│   ├── crud/                     # funções de acesso ao banco
│   │   ├── user.py
│   │   └── item.py
│   ├── api/
│   │   ├── deps.py                # get_current_user, get_db, etc.
│   │   └── routes/
│   │       ├── auth.py             # /login, /register
│   │       ├── users.py            # /users/me, dashboard
│   │       ├── items.py            # CRUD de itens
│   │       └── uploads.py          # upload de arquivos
│   └── static/ ou uploads/         # onde os arquivos enviados ficam salvos
├── tests/
├── .env
├── requirements.txt
└── README.md
```

Estrutura do Frontend:
```
frontend/
├── src/
│   ├── main.jsx                 # entry point, monta o React na página
│   ├── App.jsx                  # componente raiz, define as rotas
│   ├── api/
│   │   ├── axios.js              # instância do Axios com baseURL + interceptor de token
│   │   ├── auth.js               # funções: login(), register()
│   │   └── items.js               # funções: getItems(), createItem(), updateItem(), deleteItem()
│   ├── context/
│   │   └── AuthContext.jsx       # estado global de autenticação (usuário logado, token)
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── PrivateRoute.jsx       # protege rotas que exigem login
│   │   └── ItemForm.jsx
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── DashboardPage.jsx
│   │   └── ItemsPage.jsx
│   ├── hooks/
│   │   └── useAuth.js             # hook de conveniência pra acessar o AuthContext
│   └── styles/                    # CSS, se não usar Tailwind/styled-components
├── .env                            # VITE_API_URL=http://localhost:8000
├── index.html
├── package.json
└── vite.config.js
```
<p align="right">(<a href="#topo">Voltar ao topo</a>)</p>
<!-- GETTING STARTED -->

# <a id="comece-aqui">Comece Aqui</a>

As instruções à seguir mostram como instalar e executar o código fonte localmente.

### Preview online
* Se você quiser usar a versão online, clique <a href="https://task-tracker-api-2k8u.onrender.com">neste link</a> para iniciar o serviço de backend, e depois <a href="https://finance-tracker-sigma-bice-93.vercel.app">neste link</a> para acessar o aplicativo.

### Docker
* Para executar a versão em Docker: Baixe o código fonte do projeto e execute o seguinte comando na pasta raiz:
```
docker compose up
```

<p align="right">(<a href="#topo">Voltar ao topo</a>)</p>

## <a id="prerequisitos">Pré-requisitos</a>

* <a href="https://www.python.org/downloads">Python 3.14.7+</a>
* <a href="https://nodejs.org/pt-br/download">Node.js 18+</a>
* <a href ="https://www.postgresql.org/download">PostgreSQL 18.3+</a>

<p align="right">(<a href="#topo">Voltar ao topo</a>)</p>

## <a id="instalacao">Instalação</a>

Em construção

<!--
1. Get a free API Key at [https://example.com](https://example.com)
2. Clone the repo
   ```sh
   git clone https://github.com/github_username/repo_name.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Enter your API in `config.js`
   ```js
   const API_KEY = 'ENTER YOUR API';
   ```
5. Change git remote url to avoid accidental pushes to base project
   ```sh
   git remote set-url origin github_username/repo_name
   git remote -v # confirm the changes
   ```
-->
<p align="right">(<a href="#topo">Voltar ao topo</a>)</p>

<!-- USAGE EXAMPLES -->
## <a id="uso">Uso</a>

Em construção

<!--
Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://example.com)_

<p align="right">(<a href="#topo">Voltar ao topo</a>)</p>
-->


<!-- CONCEITOS USADOS -->
<p align="right">(<a href="#topo">Voltar ao topo</a>)</p>

# <a id="conceitos">Conceitos Usados</a>

Em construção

<p align="right">(<a href="#topo">Voltar ao topo</a>)</p>

<!-- CONTATO -->
# Contato

Em construção
<!--
Your Name - [@twitter_handle](https://twitter.com/twitter_handle) - email@email_client.com

Project Link: [https://github.com/github_username/repo_name](https://github.com/github_username/repo_name)
-->
<p align="right">(<a href="#topo">Voltar ao topo</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[product-screenshot]: screenshot.png
<!-- Shields.io badges. You can a comprehensive list with many more badges at: https://github.com/inttter/md-badges -->
[Python]: https://img.shields.io/badge/Python-14354C?style=for-the-badge&logo=python&logoColor=white
[Python-url]: https://www.python.org/
[PostgreSQL]: https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white
[PostgreSQL-url]: https://www.postgresql.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://react.dev/
[TailwindCSS]: https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white
[TailwindCSS-url]: https://tailwindcss.com/
[JavaScript]: https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black
[JavaScript-url]: https://developer.mozilla.org/pt-BR/docs/Web/JavaScript
