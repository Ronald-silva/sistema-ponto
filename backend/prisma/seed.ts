import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Criar usuário admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Administrador',
      password: adminPassword,
      role: 'ADMIN',
      salary: 5000,
      active: true,
    },
  });

  // Criar projeto
  const project = await prisma.project.upsert({
    where: { id: '550e8400-e29b-41d4-a716-446655440000' },
    update: {},
    create: {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Projeto Teste',
      description: 'Projeto para testes do sistema',
      startDate: new Date(),
      active: true,
    },
  });

  // Criar funcionário
  const employeePassword = await bcrypt.hash('func123', 10);
  const employee = await prisma.user.upsert({
    where: { email: 'funcionario@example.com' },
    update: {},
    create: {
      email: 'funcionario@example.com',
      name: 'João Silva',
      password: employeePassword,
      role: 'EMPLOYEE',
      cpf: '12345678900',
      salary: 3000,
      active: true,
    },
  });

  // Vincular funcionário ao projeto
  await prisma.usersOnProjects.upsert({
    where: {
      userId_projectId: {
        userId: employee.id,
        projectId: project.id,
      },
    },
    update: {},
    create: {
      userId: employee.id,
      projectId: project.id,
      assignedBy: admin.id,
    },
  });

  console.log('Seed executado com sucesso!');
  console.log('Admin criado:', admin.email);
  console.log('Funcionário criado:', employee.email);
  console.log('Projeto criado:', project.name);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
