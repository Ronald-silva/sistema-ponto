import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Cria um usuário admin
  const adminPassword = await hash('123456', 8);
  const admin = await prisma.usuario.upsert({
    where: { cpf: '00000000000' },
    update: {},
    create: {
      nome: 'Administrador',
      email: 'admin@example.com',
      cpf: '00000000000',
      senha: adminPassword,
      cargo: 'ADMIN',
      valor_hora: 50,
      ativo: true
    }
  });

  // Cria um usuário funcionário
  const funcionarioPassword = await hash('123456', 8);
  const funcionario = await prisma.usuario.upsert({
    where: { cpf: '11111111111' },
    update: {},
    create: {
      nome: 'Funcionário Teste',
      email: 'funcionario@example.com',
      cpf: '11111111111',
      senha: funcionarioPassword,
      cargo: 'FUNCIONARIO',
      valor_hora: 30,
      ativo: true
    }
  });

  // Cria obras
  const obras = [
    {
      nome: 'Obra Residencial Vila Nova',
      endereco: 'Rua das Flores, 123',
      ativa: true
    },
    {
      nome: 'Condomínio Parque Verde',
      endereco: 'Av. Principal, 456',
      ativa: true
    },
    {
      nome: 'Edifício Comercial Centro',
      endereco: 'Rua do Comércio, 789',
      ativa: true
    }
  ];

  const obrasCreated = await Promise.all(
    obras.map(obra =>
      prisma.obra.create({
        data: obra
      })
    )
  );

  // Vincula o funcionário às obras
  await Promise.all(
    obrasCreated.map(obra =>
      prisma.obrasUsuario.create({
        data: {
          usuario_id: funcionario.id,
          obra_id: obra.id
        }
      })
    )
  );

  console.log({
    admin,
    funcionario,
    obras: obrasCreated
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 