import { FaceRecognitionService } from '../services/FaceRecognitionService';
import * as dotenv from 'dotenv';
import axios from 'axios';
import FormData from 'form-data';
import * as fs from 'fs';
import * as path from 'path';

// Carrega as variáveis de ambiente
dotenv.config();

interface FacePPResponse {
  error_message?: string;
  faces?: Array<any>;
  request_id?: string;
  time_used?: number;
}

// Função para esperar um tempo específico
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function testFaceRecognition() {
  console.log('Iniciando teste do serviço de reconhecimento facial...');
  
  // Verificar credenciais
  if (!process.env.FACEPLUSPLUS_API_KEY || !process.env.FACEPLUSPLUS_API_SECRET) {
    console.error('Erro: Credenciais do Face++ não encontradas no arquivo .env');
    console.log('Por favor, verifique se as variáveis FACEPLUSPLUS_API_KEY e FACEPLUSPLUS_API_SECRET estão definidas');
    return;
  }

  console.log('Credenciais encontradas no arquivo .env');
  
  const service = new FaceRecognitionService();

  try {
    // Teste 1: Verificar/Criar FaceSet
    console.log('\n1. Verificando FaceSet...');
    try {
      const faceSetCreated = await service.createFaceSet('funcionarios-teste');
      console.log('FaceSet criado:', faceSetCreated);
    } catch (error: any) {
      if (error?.response?.data?.error_message === 'FACESET_EXIST') {
        console.log('FaceSet já existe, continuando com os testes...');
      } else {
        console.error('Erro detalhado ao criar FaceSet:', error?.response?.data);
        throw error;
      }
    }

    // Aguarda 1 segundo para evitar limite de concorrência
    await sleep(1000);

    // Teste 2: Detectar face usando base64
    console.log('\n2. Testando detecção de face...');
    
    // Criar uma imagem de teste com um rosto mais realista
    const canvas = require('canvas');
    const canvasObj = canvas.createCanvas(400, 400);
    const ctx = canvasObj.getContext('2d');
    
    // Fundo branco
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 400, 400);
    
    // Desenhar um rosto mais realista
    // Cabeça/rosto
    ctx.fillStyle = '#ffd5c8';
    ctx.beginPath();
    ctx.ellipse(200, 200, 80, 100, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Olhos
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.ellipse(170, 170, 20, 15, 0, 0, Math.PI * 2);
    ctx.ellipse(230, 170, 20, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Pupilas
    ctx.fillStyle = '#4a4a4a';
    ctx.beginPath();
    ctx.arc(170, 170, 8, 0, Math.PI * 2);
    ctx.arc(230, 170, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Sobrancelhas
    ctx.strokeStyle = '#4a4a4a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(150, 150);
    ctx.quadraticCurveTo(170, 145, 190, 150);
    ctx.moveTo(210, 150);
    ctx.quadraticCurveTo(230, 145, 250, 150);
    ctx.stroke();
    
    // Nariz
    ctx.beginPath();
    ctx.moveTo(200, 170);
    ctx.quadraticCurveTo(200, 200, 190, 210);
    ctx.quadraticCurveTo(200, 215, 210, 210);
    ctx.stroke();
    
    // Boca
    ctx.strokeStyle = '#ff9999';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(170, 240);
    ctx.quadraticCurveTo(200, 260, 230, 240);
    ctx.stroke();
    
    // Converter para base64
    const base64Image = canvasObj.toDataURL().split(',')[1];

    const formData = new FormData();
    formData.append('api_key', process.env.FACEPLUSPLUS_API_KEY || '');
    formData.append('api_secret', process.env.FACEPLUSPLUS_API_SECRET || '');
    formData.append('image_base64', base64Image);
    formData.append('return_attributes', 'gender,age');

    let response = await axios.post<FacePPResponse>(
      'https://api-us.faceplusplus.com/facepp/v3/detect',
      formData,
      {
        headers: formData.getHeaders(),
      }
    );

    let responseData = response.data;
    
    if (responseData.error_message) {
      console.error('Erro na detecção:', responseData.error_message);
      if (responseData.error_message === 'CONCURRENCY_LIMIT_EXCEEDED') {
        console.log('Limite de concorrência atingido. Aguardando 2 segundos e tentando novamente...');
        await sleep(2000);
        response = await axios.post<FacePPResponse>(
          'https://api-us.faceplusplus.com/facepp/v3/detect',
          formData,
          {
            headers: formData.getHeaders(),
          }
        );
        responseData = response.data;
      } else {
        throw new Error(`Erro na API: ${responseData.error_message}`);
      }
    }

    console.log('Resposta da API:', JSON.stringify(responseData, null, 2));

    if (!responseData.faces || responseData.faces.length === 0) {
      console.log('Nenhuma face detectada na imagem de teste (isso é esperado para nossa imagem simples)');
      console.log('O teste básico de conexão com a API foi bem sucedido!');
    } else {
      console.log(`Faces detectadas: ${responseData.faces.length}`);
      console.log('\nDetalhes das faces detectadas:');
      responseData.faces.forEach((face, index) => {
        console.log(`\nFace ${index + 1}:`);
        if (face.attributes) {
          console.log(`- Gênero: ${face.attributes.gender.value}`);
          console.log(`- Idade estimada: ${face.attributes.age.value}`);
        }
      });
    }

    console.log('\nTeste concluído com sucesso!');
    console.log('Credenciais do Face++ estão funcionando corretamente.');

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('\nErro durante o teste:', error.response?.data || error.message);
      if (error.response?.data?.error_message) {
        console.error('\nMensagem de erro da API:', error.response.data.error_message);
      }
      console.error('\nStatus do erro:', error.response?.status);
      console.error('\nHeaders da resposta:', error.response?.headers);
    } else {
      console.error('\nErro durante o teste:', error);
    }
    console.error('\nVerifique suas credenciais e conexão com a internet.');
    process.exit(1);
  }
}

// Executa o teste
testFaceRecognition(); 