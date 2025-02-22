import fs from 'fs'
import path from 'path'
import https from 'https'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const modelsDir = path.join(__dirname, '../public/models')
const baseUrl = 'https://github.com/justadudewhohacks/face-api.js/raw/master/weights'

const models = [
  'ssd_mobilenetv1_model-weights_manifest.json',
  'ssd_mobilenetv1_model-shard1',
  'face_landmark_68_model-weights_manifest.json',
  'face_landmark_68_model-shard1',
  'face_recognition_model-weights_manifest.json',
  'face_recognition_model-shard1',
  'face_recognition_model-shard2'
]

// Criar diretório se não existir
if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir, { recursive: true })
}

// Função para baixar arquivo
function downloadFile(filename) {
  const url = `${baseUrl}/${filename}`
  const filePath = path.join(modelsDir, filename)

  return new Promise((resolve, reject) => {
    console.log(`Baixando ${filename}...`)
    
    const file = fs.createWriteStream(filePath)
    https.get(url, response => {
      response.pipe(file)
      file.on('finish', () => {
        file.close()
        resolve()
      })
    }).on('error', err => {
      fs.unlink(filePath, () => {})
      reject(err)
    })
  })
}

// Baixar todos os modelos
async function downloadModels() {
  try {
    for (const model of models) {
      await downloadFile(model)
    }
    console.log('Todos os modelos foram baixados com sucesso!')
  } catch (err) {
    console.error('Erro ao baixar modelos:', err)
    process.exit(1)
  }
}

downloadModels()
