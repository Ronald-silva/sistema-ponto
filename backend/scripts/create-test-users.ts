import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  try {
    // Criar admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        name: 'Administrador',
        password: adminPassword,
        role: 'ADMIN',
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
        cpf: '98765432100',
        role: 'EMPLOYEE',
        active: true,
      },
    });

    console.log('Funcionário criado:', employee);

    console.log('\nCredenciais de acesso:');
    console.log('Admin - Email: admin@example.com, Senha: admin123');
    console.log('Funcionário - CPF: 98765432100');

  } catch (error) {
    console.error('Erro ao criar usuários:', error);
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
