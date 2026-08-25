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
      </ul>
      <li><a href="#instalacao">Instalação</a></li>
        <ul>
          <li><a href="#backend">Backend</a></li>
          <li><a href="#frontend">Frontend</a></li>
          <li><a href="#docker">Docker</a></li>
        </ul>
    </li>
    <li><a href="#uso">Uso</a></li>
    <li><a href="#conceitos">Conceitos usados</a></li>
  </ol>
</details>

<!-- SOBRE O PROJETO -->
# <h3 id="sobre-o-projeto">Sobre o projeto</h3>

![Product Name Screen Shot][product-screenshot]

Aplicativo de finanças pessoais. Registre seus gastos e ganhos para ter um controle organizado da sua renda. Desenvolvido como o sétimo projeto de um desafio de desenvolvimento de 12 meses, com foco em conceitos avançados de React e Python.

# <h3 id="funcionalidades">Funcionalidades</h3>

* Criação de contas e autenticação por token
* Rotas protegidas
* Dashboard com resumos, gráficos e itens com maiores valores
* Rota para criação, edição e exclusão de gastos e ganhos
* Tabelas com todos os gastos e ganhos registrados
* Função de filtro por categoria, data inicial e data final
* Upload de imagem para cara item cadastrado

<p align="right">(<a href="#topo">Voltar ao topo</a>)</p>

# <h3 id="feito-com">Tecnologias usadas</h3>

* [![Python][Python]][Python-url]
* [![PostgreSQL][PostgreSQL]][PostgreSQL-url]
* [![React][React.js]][React-url]
* [![TailwindCSS][TailwindCSS]][TailwindCSS-url]
* [![JavaScript][JavaScript]][JavaScript-url]

<p align="right">(<a href="#topo">Voltar ao topo</a>)</p>

# <h3 id="estrutura">Estrutura do projeto</h3>


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

# <h3 id="comece-aqui">Comece Aqui</h3>

As instruções à seguir mostram como instalar e executar o código fonte localmente.

### Preview online
* Se você quiser usar a versão online, clique <a href="https://task-tracker-api-2k8u.onrender.com" target="_blank">neste link</a> para iniciar o serviço de backend, e depois <a href="https://finance-tracker-sigma-bice-93.vercel.app" target="_blank">neste link</a> para acessar o aplicativo.
<p align="right">(<a href="#topo">Voltar ao topo</a>)</p>

# <h3 id="prerequisitos">Pré-requisitos</h3>

* <a href="https://www.python.org/downloads">Python 3.14.7+</a>
* <a href="https://nodejs.org/pt-br/download">Node.js 18+</a>
* <a href ="https://www.postgresql.org/download">PostgreSQL 18.3+</a>
* <a href="https://git-scm.com/install/windows">Git Bash para Windows</a> (Opcional)
* <a href="https://www.docker.com/products/docker-desktop/?at_exp=DO105.A-DO106.B">Docker</a> (Opcional)

<p align="right">(<a href="#topo">Voltar ao topo</a>)</p>

# <h3 id="instalacao">Instalação</h3>
Clone o repositório
```sh
git clone https://github.com/tiago3292/finances
cd finances
```
### <h3 id="backend">Backend</h3>

### 1. Crie e ative o ambiente virtual
```sh
cd backend
python -m venv venv
source venv/Scripts/activate  # Windows com Git Bash
source venv/bin/activate # Linux/MacOS
```
### 2. Instale as dependências
```sh
pip install -r requirements.txt
```
### 3. Configure as variáveis de ambiente
```sh
cp .env.example .env
```
Abra o .env e preencha com os dados do seu banco de dados:
```sh
DATABASE_URL=postgresql://username:password@localhost:5432/finances
SECRET_KEY=your_secret_key_here_generate_with_openssl_rand_hex_32
ALGORITHM=your_algorithm_here--delfault:HS256
ACCESS_TOKEN_EXPIRE_MINUTES=int_here
```
### 4. Atualize o banco de dados
```sh
alembic upgrade head
```
### 5. Inicie o servidor
```sh
uvicorn app.main:app --reload
```

### <h3 id="frontend">Frontend</h3>

### 1. Instale as dependências
```sh
cd ../frontend # Se estiver na pasta raiz: cd frontend
npm install
```
### 2. Executar
```sh
npm run dev
```

### <h3 id="docker">Docker</h3>
### 1. Configure as variáveis de ambiente
```sh
cd ../ # Se estiver na pasta "frontend"
cp .env.docker.example .env.docker
```
Abra o .env.docker e preencha com os dados do seu banco de dados:
```sh
DATABASE_URL=postgresql://username:password@db:5432/finances
POSTGRES_USER=db_username
POSTGRES_PASSWORD=db_password
```
### 2. Construa todas as imagens e containers
```sh
docker compose up
```
<p align="right">(<a href="#topo">Voltar ao topo</a>)</p>

<!-- USAGE EXAMPLES -->
## <h3 id="uso">Uso</h3>

Com os servidores do backend e frontend em execução, acesse os seguintes endereços no seu navegador:
### API
```sh
http://localhost:8000/docs # Swagger UI
http://localhost:8000/redoc # ReDoc
```
### Aplicativo
```sh
http://localhost:5173
```
### Docker
```sh
# API
http://0.0.0.0:8000/docs # Swagger UI
http://0.0.0.0:8000/redoc # ReDoc

# Aplicativo
http://localhost:3000
```

<!-- CONCEITOS USADOS -->
<p align="right">(<a href="#topo">Voltar ao topo</a>)</p>

# <h3 id="conceitos">Conceitos Usados</h3>

* CRUD
* Alembic para migration de tabelas
* Relations e exclusão em cascata no banco de dados
* @hybrid_property e @model_validator para categorizações condicionais de dados
* JWT authentication flow para autenticação via token e rotas protegidas
* CORS
* Interceptor do Axios
* Sistema de upload de arquivo relacionado ao item
* Filtragem de itens no frontend
* Tailwind no React para estilização
* Docker
* Deploys em sites hospedeiros (Render para o backend, Vercel para o frontend)
* CI/CD com Github actions

<p align="right">(<a href="#topo">Voltar ao topo</a>)</p>

<!-- CONTATO -->
### Contato
[![Linkedin][Linkedin]][Linkedin-url]
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
[Linkedin]: https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white
[Linkedin-url]: https://www.linkedin.com/in/tiagosantos92/
