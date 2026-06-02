import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Iniciando seed...');

  // --- CLIENTES ---
  const clientes = await Promise.all([
    prisma.cliente.create({ data: { nome: 'Alice Souza', email: 'alice@email.com' } }),
    prisma.cliente.create({ data: { nome: 'Bruno Lima', email: 'bruno@email.com' } }),
    prisma.cliente.create({ data: { nome: 'Carla Mendes', email: 'carla@email.com' } }),
    prisma.cliente.create({ data: { nome: 'Daniel Costa', email: 'daniel@email.com' } }),
    prisma.cliente.create({ data: { nome: 'Eva Ribeiro', email: 'eva@email.com' } }),
    prisma.cliente.create({ data: { nome: 'Felipe Alves', email: 'felipe@email.com' } }),
    prisma.cliente.create({ data: { nome: 'Gabriela Nunes', email: 'gabriela@email.com' } }),
    prisma.cliente.create({ data: { nome: 'Henrique Dias', email: 'henrique@email.com' } }),
    prisma.cliente.create({ data: { nome: 'Isabela Ferreira', email: 'isabela@email.com' } }),
    prisma.cliente.create({ data: { nome: 'João Pereira', email: 'joao@email.com' } }),
  ]);

  console.log(`✅ ${clientes.length} clientes criados`);

  // --- PLANOS ---
  const planos = await Promise.all([
    prisma.plano.create({
      data: {
        nome: 'Plano Básico',
        custoMensal: 49.90,
        descricao: 'Internet fibra 100MB, sem TV',
      },
    }),
    prisma.plano.create({
      data: {
        nome: 'Plano Intermediário',
        custoMensal: 89.90,
        descricao: 'Internet fibra 300MB, TV inclusa',
      },
    }),
    prisma.plano.create({
      data: {
        nome: 'Plano Avançado',
        custoMensal: 129.90,
        descricao: 'Internet fibra 500MB, TV e telefone fixo',
      },
    }),
    prisma.plano.create({
      data: {
        nome: 'Plano Premium',
        custoMensal: 199.90,
        descricao: 'Internet fibra 1GB, TV premium e telefone fixo',
      },
    }),
    prisma.plano.create({
      data: {
        nome: 'Plano Mobile',
        custoMensal: 39.90,
        descricao: 'Internet móvel 20GB, sem fibra',
      },
    }),
  ]);

  console.log(`✅ ${planos.length} planos criados`);

  // --- ASSINATURAS ---
  const agora = new Date();

  // Assinatura ATIVA em fidelidade (contratada há 30 dias)
  const dataContratacao1 = new Date(agora);
  dataContratacao1.setDate(agora.getDate() - 30);
  const fimFidelidade1 = new Date(dataContratacao1);
  fimFidelidade1.setDate(dataContratacao1.getDate() + 365);

  // Assinatura ATIVA em fidelidade (contratada há 60 dias)
  const dataContratacao2 = new Date(agora);
  dataContratacao2.setDate(agora.getDate() - 60);
  const fimFidelidade2 = new Date(dataContratacao2);
  fimFidelidade2.setDate(dataContratacao2.getDate() + 365);

  // Assinatura ATIVA em fidelidade (contratada há 10 dias)
  const dataContratacao3 = new Date(agora);
  dataContratacao3.setDate(agora.getDate() - 10);
  const fimFidelidade3 = new Date(dataContratacao3);
  fimFidelidade3.setDate(dataContratacao3.getDate() + 365);

  // Assinatura CANCELADA — último pagamento há 31 dias (sem tolerância)
  const dataContratacao4 = new Date(agora);
  dataContratacao4.setDate(agora.getDate() - 400);
  const fimFidelidade4 = new Date(dataContratacao4);
  fimFidelidade4.setDate(dataContratacao4.getDate() + 365);
  const ultimoPagamento4 = new Date(agora);
  ultimoPagamento4.setDate(agora.getDate() - 31);

  // Assinatura CANCELADA — último pagamento há 45 dias
  const dataContratacao5 = new Date(agora);
  dataContratacao5.setDate(agora.getDate() - 200);
  const fimFidelidade5 = new Date(dataContratacao5);
  fimFidelidade5.setDate(dataContratacao5.getDate() + 365);
  const ultimoPagamento5 = new Date(agora);
  ultimoPagamento5.setDate(agora.getDate() - 45);

  const assinaturas = await Promise.all([
    prisma.assinatura.create({
      data: {
        codPlano: planos[0].codigo,
        codCli: clientes[0].codigo,
        inicioFidelidade: dataContratacao1,
        fimFidelidade: fimFidelidade1,
        dataUltimoPagamento: dataContratacao1,
        custoFinal: 39.90,
        descricao: 'Desconto fidelidade 20% aplicado',
      },
    }),
    prisma.assinatura.create({
      data: {
        codPlano: planos[1].codigo,
        codCli: clientes[1].codigo,
        inicioFidelidade: dataContratacao2,
        fimFidelidade: fimFidelidade2,
        dataUltimoPagamento: dataContratacao2,
        custoFinal: 71.90,
        descricao: 'Desconto fidelidade 20% aplicado',
      },
    }),
    prisma.assinatura.create({
      data: {
        codPlano: planos[2].codigo,
        codCli: clientes[2].codigo,
        inicioFidelidade: dataContratacao3,
        fimFidelidade: fimFidelidade3,
        dataUltimoPagamento: dataContratacao3,
        custoFinal: 103.90,
        descricao: 'Desconto fidelidade 20% aplicado',
      },
    }),
    prisma.assinatura.create({
      data: {
        codPlano: planos[3].codigo,
        codCli: clientes[3].codigo,
        inicioFidelidade: dataContratacao4,
        fimFidelidade: fimFidelidade4,
        dataUltimoPagamento: ultimoPagamento4,
        custoFinal: 199.90,
        descricao: 'Sem desconto — fora do período de fidelidade',
      },
    }),
    prisma.assinatura.create({
      data: {
        codPlano: planos[4].codigo,
        codCli: clientes[4].codigo,
        inicioFidelidade: dataContratacao5,
        fimFidelidade: fimFidelidade5,
        dataUltimoPagamento: ultimoPagamento5,
        custoFinal: 39.90,
        descricao: 'Sem desconto — fora do período de fidelidade',
      },
    }),
  ]);

  console.log(`✅ ${assinaturas.length} assinaturas criadas`);
  console.log('🎉 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });