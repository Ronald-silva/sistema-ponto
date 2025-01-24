"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = require("bcryptjs");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // Cria um usuário admin
        const adminPassword = yield (0, bcryptjs_1.hash)('123456', 8);
        const admin = yield prisma.usuario.upsert({
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
        const funcionarioPassword = yield (0, bcryptjs_1.hash)('123456', 8);
        const funcionario = yield prisma.usuario.upsert({
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
        const obrasCreated = yield Promise.all(obras.map(obra => prisma.obra.create({
            data: obra
        })));
        // Vincula o funcionário às obras
        yield Promise.all(obrasCreated.map(obra => prisma.obrasUsuario.create({
            data: {
                usuario_id: funcionario.id,
                obra_id: obra.id
            }
        })));
        console.log({
            admin,
            funcionario,
            obras: obrasCreated
        });
    });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
