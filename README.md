# 📡 Sistema Distribuído de Gestão de Planos e Assinaturas (Telecom)

---

## 🛠️ Tecnologias e Ferramentas Utilizadas

* **Runtime:** Node.js (v20+)
* **Linguagem:** TypeScript / JavaScript (ESNext)
* **Framework Backend:** NestJS
* **Mapeamento Objeto-Relacional:** Prisma ORM
* **Bancos de Dados:** PostgreSQL (Persistência Relacional) & Redis (Cache em Memória)
* **Mensageria/Eventos:** RabbitMQ / Apache Kafka (Message Broker)
* **Suíte de Testes:** Jest
* **Documentação & Testes de API:** Postman

---

## 🏛️ Arquitetura do Ecossistema

O sistema adota uma **Arquitetura Híbrida** composta por uma API Gateway como porta de entrada única, um serviço central em Arquitetura Limpa e dois microsserviços especializados integrados de forma síncrona e assíncrona.

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