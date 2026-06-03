# 📡 Sistema Distribuído de Gestão de Planos e Assinaturas (Telecom)

## 📖 Sobre o Projeto

Sistema desenvolvido para gerenciamento de clientes, planos e assinaturas de uma operadora de telecomunicações.

A solução foi concebida como um ecossistema distribuído composto por três serviços independentes:

* **ServicoGestao** — responsável pelo cadastro e gerenciamento de clientes, planos e assinaturas.
* **ServicoFaturamento** — responsável pelo processamento de pagamentos e faturamento.
* **ServicoPlanosAtivos** — responsável pela consulta otimizada de assinaturas ativas através de cache.

A comunicação entre os serviços ocorre por meio de eventos publicados em um broker de mensagens, permitindo desacoplamento e escalabilidade.

---

## 🛠️ Tecnologias e Ferramentas Utilizadas

| Categoria        | Tecnologia       |
| ---------------- | ---------------- |
| Runtime          | Node.js 20+      |
| Linguagem        | TypeScript       |
| Framework        | NestJS           |
| ORM              | Prisma           |
| Banco Relacional | PostgreSQL       |
| Cache            | Redis            |
| Mensageria       | RabbitMQ / Kafka |
| Testes           | Jest             |
| API Testing      | Postman          |
| Containerização  | Docker           |

---

## 🏛️ Arquitetura do Ecossistema

> Inserir aqui o diagrama arquitetural do sistema.

---

## 🎯 Arquitetura e Boas Práticas Aplicadas

O projeto foi desenvolvido utilizando:

* Clean Architecture
* Domain-Driven Design (DDD)
* SOLID
* Design Patterns GoF
* Dependency Injection
* Repository Pattern
* Event-Driven Architecture

### Principais Patterns Utilizados

| Pattern         | Aplicação                                      |
| --------------- | ---------------------------------------------- |
| Factory Method  | Criação e reconstrução de entidades de domínio |
| Strategy        | Filtragem de assinaturas por tipo              |
| Adapter         | Integração dos repositórios Prisma             |
| Facade          | Controllers HTTP                               |
| Null Object     | `NoOpEventPublisher`                           |
| Singleton       | `PrismaService`                                |
| Template Method | Hierarquia de erros de domínio                 |

---

## 📂 Estrutura da Solução

```text
servico-gestao/
├── src/
│   ├── domain/
│   │   ├── entities/
│   │   ├── value-objects/
│   │   └── events/
│   │
│   ├── application/
│   │   ├── ports/
│   │   └── use-cases/
│   │
│   ├── adapters/
│   │   ├── controllers/
│   │   └── repositories/
│   │
│   ├── infrastructure/
│   │   ├── database/
│   │   └── container/
│   │
│   └── shared/
│       └── errors/
│
└── prisma/
```

---

## 📊 Diagramas de Classe

Os diagramas de classe completos encontram-se na pasta de documentação.

Arquivos disponíveis:

* Diagramas Mermaid (`.mmd`)
* Diagramas segmentados por camada
* Diagrama completo em PDF

---

## 🚀 Executando o Projeto

### Pré-requisitos

* Node.js 20+
* Docker Desktop
* npm 10+

### 1. Subir o banco de dados

```bash
docker-compose up -d
```

### 2. Instalar dependências

```bash
cd servico-gestao
npm install
```

### 3. Configurar variáveis de ambiente

O projeto já contém um arquivo `.env` configurado:

```env
DATABASE_URL="postgresql://postgres:senha123@localhost:5432/servico_gestao"
```

### 4. Executar migrations

```bash
npx prisma migrate deploy
```

### 5. Popular banco de dados

```bash
npm run seed
```

Serão inseridos:

* 10 clientes
* 5 planos
* 5 assinaturas

  * 3 ativas
  * 2 canceladas

### 6. Iniciar aplicação

```bash
npm run start:dev
```

Servidor disponível em:

```text
http://localhost:3000
```

---

## 🔌 Endpoints Disponíveis

| Método | Endpoint                             | Descrição                       |
| ------ | ------------------------------------ | ------------------------------- |
| GET    | `/gestao/clientes`                   | Lista clientes                  |
| GET    | `/gestao/planos`                     | Lista planos                    |
| POST   | `/gestao/assinaturas`                | Cria assinatura                 |
| PATCH  | `/gestao/planos/:idPlano`            | Atualiza custo mensal do plano  |
| GET    | `/gestao/assinaturas/:tipo`          | Lista assinaturas por tipo      |
| GET    | `/gestao/assinaturascliente/:codcli` | Lista assinaturas de um cliente |
| GET    | `/gestao/assinaturasplano/:codplano` | Lista assinaturas de um plano   |

### Valores aceitos para `:tipo`

* `TODOS`
* `ATIVOS`
* `CANCELADOS`

---

## 🧪 Testes

Executar testes unitários:

```bash
npm test
```

Executar testes end-to-end:

```bash
npm run test:e2e
```

---

## 📌 Principais Desafios Técnicos

Durante o desenvolvimento foram enfrentados desafios relacionados a:

* Separação entre domínio e infraestrutura.
* Reconstrução de entidades persistidas utilizando Factory Methods.
* Serialização de identificadores BigInt em respostas JSON.
* Configuração do ambiente Docker e PostgreSQL.
* Manutenção da conformidade arquitetural utilizando Value Objects.

---

## 📚 Documentação Complementar

A documentação completa do projeto contém:

* Diagramas UML
* Diagramas Mermaid
* Relatório de aderência aos princípios SOLID
* Relatório de Design Patterns GoF
* Decisões arquiteturais
* Relatório da Fase 1

---

## 🎓 Objetivos Acadêmicos

Este projeto foi desenvolvido como parte da disciplina de **Desenvolvimento de Sistemas Backend**, com foco na aplicação prática de:

* Arquitetura Limpa (Clean Architecture)
* Domain-Driven Design (DDD)
* Princípios SOLID
* Design Patterns GoF
* Microsserviços
* Mensageria baseada em eventos
* Persistência relacional com PostgreSQL
* Desenvolvimento backend com NestJS e TypeScript