# 📡 Sistema Distribuído de Gestão de Planos e Assinaturas (Telecom)

Este repositório contém a solução completa para um ecossistema backend voltado ao gerenciamento integrado de planos e assinaturas para operadoras de internet. O projeto foi concebido e evoluído em duas fases acadêmicas distintas, transitando de um serviço principal monolítico altamente estruturado para um ecossistema distribuído baseado em microsserviços de alta performance.

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