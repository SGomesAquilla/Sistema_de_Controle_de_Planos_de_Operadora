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

```text
                               ┌───────────────┐
                               │  API Gateway  │
                               └───────┬───────┘
                                       │ (Roteamento Síncrono)
         ┌─────────────────────────────┼─────────────────────────────┐
         ▼                             ▼                             ▼
┌──────────────────┐          ┌──────────────────┐          ┌──────────────────┐
│  servico-gestao  │          │servico-faturam...│          │servico-planos-...│
│  (Core Domain)   │          │ (Payments MS)    │          │   (Cache MS)     │
└────────┬─────────┘          └────────┬─────────┘          └────────┬─────────┘
         │                             │                             │
   [PostgreSQL]                  [PostgreSQL]                     [Redis]
         ▲                             │                             ▲
         │                             │ (Dispara Evento)            │
         │                             ▼                             │
         │                    ┌──────────────────┐                   │
         └────────────────────┤  Message Broker  ├───────────────────┘
          (Consome e Atualiza)└──────────────────┘(Consome e Invalida)
```

---

## Diagrama de Classes

```mermaid
classDiagram

class AppModule{
            
            
        }
class AssinaturaController{
            -criarAssinaturaUseCase: CriarAssinaturaUseCase
-listarAssinaturasPorTipoUseCase: ListarAssinaturasPorTipoUseCase
-listarAssinaturasPorClienteUseCase: ListarAssinaturasPorClienteUseCase
-listarAssinaturasPorPlanoUseCase: ListarAssinaturasPorPlanoUseCase
            +criarAssinatura() Promise~AssinaturaResponseDTO~
+listarPorTipo() Promise~AssinaturaResponseDTO[]~
+listarPorCliente() Promise~AssinaturaResponseDTO[]~
+listarPorPlano() Promise~AssinaturaResponseDTO[]~
        }
class ClienteController{
            -listarClientesUseCase: ListarClientesUseCase
            +listarClientes() Promise~ClienteResponseDTO[]~
        }
class PlanoController{
            -listarPlanosUseCase: ListarPlanosUseCase
-atualizarCustoPlanoUseCase: AtualizarCustoPlanoUseCase
            +listarPlanos() Promise~PlanoResponseDTO[]~
+atualizarCusto() Promise~PlanoResponseDTO~
        }
class AssinaturaModule{
            
            
        }
class ClienteModule{
            
            
        }
class PlanoModule{
            
            
        }
class PrismaAssinaturaRepository{
            -prisma: PrismaService
            -toEntity() Assinatura
+save() Promise~Assinatura~
+findAll() Promise~Assinatura[]~
+findById() Promise~Assinatura | null~
+findByCliente() Promise~Assinatura[]~
+findByPlano() Promise~Assinatura[]~
+findByStatus() Promise~Assinatura[]~
        }
IAssinaturaRepository<|..PrismaAssinaturaRepository
class PrismaClienteRepository{
            -prisma: PrismaService
            +findAll() Promise~Cliente[]~
+findById() Promise~Cliente | null~
        }
IClienteRepository<|..PrismaClienteRepository
class PrismaPlanoRepository{
            -prisma: PrismaService
            +findAll() Promise~Plano[]~
+findById() Promise~Plano | null~
+updateCustoMensal() Promise~Plano~
        }
IPlanoRepository<|..PrismaPlanoRepository
class AssinaturaResponseDTO {
            <<interface>>
            +codigo: bigint
+codCli: bigint
+codPlano: bigint
+custoFinal: number
+descricao: string
+inicioFidelidade: Date
+fimFidelidade: Date
+dataUltimoPagamento: Date
+status: string
+emFidelidade: boolean
            
        }
class AtualizarPlanoDTO {
            <<interface>>
            +codigo: bigint
+custoMensal: number
            
        }
class ClienteResponseDTO {
            <<interface>>
            +codigo: bigint
+nome: string
+email: string
            
        }
class CriarAssinaturaDTO {
            <<interface>>
            +codCli: bigint
+codPlano: bigint
+custoFinal: number
+descricao: string
            
        }
class ListarAssinaturasDTO {
            <<interface>>
            +tipo: TipoListagemAssinatura
            
        }
class PlanoResponseDTO {
            <<interface>>
            +codigo: bigint
+nome: string
+custoMensal: number
+descricao: string
+data: Date
            
        }
class IAssinaturaRepository {
            <<interface>>
            
            +save() Promise~Assinatura~
+findAll() Promise~Assinatura[]~
+findById() Promise~Assinatura | null~
+findByCliente() Promise~Assinatura[]~
+findByPlano() Promise~Assinatura[]~
+findByStatus() Promise~Assinatura[]~
        }
class IClienteRepository {
            <<interface>>
            
            +findAll() Promise~Cliente[]~
+findById() Promise~Cliente | null~
        }
class IDomainEvent {
            <<interface>>
            +eventName: string
+occurredAt: Date
+payload: Record~string, unknown~
            
        }
class IEventPublisher {
            <<interface>>
            
            +publish() Promise~void~
        }
class IPlanoRepository {
            <<interface>>
            
            +findAll() Promise~Plano[]~
+findById() Promise~Plano | null~
+updateCustoMensal() Promise~Plano~
        }
class Assinatura{
            -DIAS_VALIDADE_PAGAMENTO: 30$
+codigo: bigint
+codPlano: bigint
+codCli: bigint
-periodoFidelidade: Periodo
+dataUltimoPagamento: Date
+custoFinal: number
+descricao: string
            +criar() Assinatura$
+reconstituir() Assinatura$
+estaAtiva() boolean
+obterStatus() StatusAssinatura
+estaEmFidelidade() boolean
+registrarPagamento() void
+alterarPeriodoFidelidade() void
        }
class StatusAssinatura {
        <<enumeration>>
        ATIVO
CANCELADO
      }
class Cliente{
            +codigo: bigint
+nome: string
+email: string
            -validar() void
        }
class PagamentoInvalidoError{
            
            
        }
class Pagamento{
            +codigo: bigint
+codAss: bigint
+valorPago: number
+dataPagamento: Date
            -validar() void
        }
DomainError<|--PagamentoInvalidoError
class Plano{
            +custoMensal: CustoMensal
+codigo: bigint
+nome: string
+data: Date
+descricao: string
            +atualizarCusto() void
-validar() void
        }
class CustoMensal{
            +valor: number
            +equals() boolean
        }
class Periodo{
            -DIAS_FIDELIDADE_PADRAO: 365$
+inicio: Date
+fim: Date
            +criarComFidelidadePadrao() Periodo$
+contem() boolean
+equals() boolean
        }
class NoOpEventPublisher{
            
            +publish() Promise~void~
        }
IEventPublisher<|..NoOpEventPublisher
class AssinaturaInvalidaError{
            
            
        }
class AssinaturaNaoEncontradaError{
            
            
        }
DomainError<|--AssinaturaInvalidaError
DomainError<|--AssinaturaNaoEncontradaError
class ClienteInvalidoError{
            
            
        }
class ClienteNaoEncontradoError{
            
            
        }
DomainError<|--ClienteInvalidoError
DomainError<|--ClienteNaoEncontradoError
class DomainError{
            
            
        }
class PlanoInvalidoError{
            
            
        }
class PlanoNaoEncontradoError{
            
            
        }
DomainError<|--PlanoInvalidoError
DomainError<|--PlanoNaoEncontradoError
class CustoMensalInvalidoError{
            
            
        }
class PeriodoInvalidoError{
            
            
        }
DomainError<|--CustoMensalInvalidoError
DomainError<|--PeriodoInvalidoError
class Result~T~{
            +isSuccess: boolean
+error?: string
+value?: T
            +ok() Result~T~$
+fail() Result~T~$
        }
class CriarAssinaturaUseCase{
            -assinaturaRepository: IAssinaturaRepository
-clienteRepository: IClienteRepository
-planoRepository: IPlanoRepository
-eventPublisher: IEventPublisher
            +execute() Promise~AssinaturaResponseDTO~
-toResponseDTO() AssinaturaResponseDTO
        }
class ListarAssinaturasPorClienteUseCase{
            -assinaturaRepository: IAssinaturaRepository
-clienteRepository: IClienteRepository
            +execute() Promise~AssinaturaResponseDTO[]~
        }
class ListarAssinaturasPorPlanoUseCase{
            -assinaturaRepository: IAssinaturaRepository
-planoRepository: IPlanoRepository
            +execute() Promise~AssinaturaResponseDTO[]~
        }
class ListarTodosStrategy{
            
            +executar() Promise~Assinatura[]~
        }
class ListarAtivosStrategy{
            
            +executar() Promise~Assinatura[]~
        }
class ListarCanceladosStrategy{
            
            +executar() Promise~Assinatura[]~
        }
class ListarAssinaturasPorTipoUseCase{
            -assinaturaRepository: IAssinaturaRepository
            +execute() Promise~AssinaturaResponseDTO[]~
        }
class IListagemStrategy {
            <<interface>>
            
            +executar() Promise~Assinatura[]~
        }
IListagemStrategy<|..ListarTodosStrategy
IListagemStrategy<|..ListarAtivosStrategy
IListagemStrategy<|..ListarCanceladosStrategy
class ListarClientesUseCase{
            -clienteRepository: IClienteRepository
            +execute() Promise~ClienteResponseDTO[]~
        }
class AtualizarCustoPlanoUseCase{
            -planoRepository: IPlanoRepository
            +execute() Promise~PlanoResponseDTO~
        }
class ListarPlanosUseCase{
            -planoRepository: IPlanoRepository
            +execute() Promise~PlanoResponseDTO[]~
        }
class PrismaModule{
            
            
        }
class PrismaService{
            
            +onModuleInit() Promise~void~
+onModuleDestroy() Promise~void~
        }
PrismaClient~ClientOptions,U,ExtArgs~<|--PrismaService
OnModuleInit<|..PrismaService
OnModuleDestroy<|..PrismaService
```

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

Caso ja nao possua, crie um arquivo `.env` configurado com o seguinte conteudo:

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