import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  try {
    // Criar projeto de teste
    const project = await prisma.project.create({
      data: {
        name: 'Projeto Teste',
        description: 'Projeto para testes do sistema',
        startDate: new Date(),
        active: true,
      },
    });

    console.log('Projeto criado:', project);

    // Criar admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        name: 'Administrador',
        password: adminPassword,
        role: 'ADMIN',
        salary: 5000,
        active: true,
      },
    });

    console.log('Admin criado:', admin);

    // Criar funcionário
    const employeePassword = await bcrypt.hash('func123', 10);
    const employee = await prisma.user.create({
      data: {
        email: 'funcionario@example.com',
        name: 'João Silva',
        password: employeePassword,
        cpf: '12345678900',
        role: 'EMPLOYEE',
        salary: 3000,
        active: true,
        projects: {
          create: {
            projectId: project.id,
            assignedBy: admin.id,
          },
        },
      },
    });

    console.log('Funcionário criado:', employee);

    console.log('\nCredenciais de acesso:');
    console.log('Admin - Email: admin@example.com, Senha: admin123');
    console.log('Funcionário - CPF: 12345678900');

  } catch (error) {
    console.error('Erro ao configurar banco de dados:', error);
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
