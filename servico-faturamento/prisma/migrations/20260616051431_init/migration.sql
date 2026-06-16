-- CreateTable
CREATE TABLE "Pagamento" (
    "codigo" BIGSERIAL NOT NULL,
    "codAss" BIGINT NOT NULL,
    "valorPago" DOUBLE PRECISION NOT NULL,
    "dataPagamento" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pagamento_pkey" PRIMARY KEY ("codigo")
);
