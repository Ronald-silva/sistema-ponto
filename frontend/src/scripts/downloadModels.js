import fs from 'fs'
import path from 'path'
import https from 'https'

const modelsDir = path.join(process.cwd(), 'public', 'models')
const baseUrl = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights'

const models = [
  'ssd_mobilenetv1_model-weights_manifest.json',
  'ssd_mobilenetv1_model-shard1',
  'face_landmark_68_model-weights_manifest.json',
  'face_landmark_68_model-shard1',
  'face_recognition_model-weights_manifest.json',
  'face_recognition_model-shard1'
]

// Criar diretório se não existir
if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir, { recursive: true })
}

// Função para baixar arquivo
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest)
    https.get(url, response => {
      response.pipe(file)
      file.on('finish', () => {
        file.close()
        resolve()
      })
    }).on('error', err => {
      fs.unlink(dest, () => reject(err))
    })
  })
}

// Baixar todos os modelos
async function downloadModels() {
  for (const model of models) {
    const url = `${baseUrl}/${model}`
    const dest = path.join(modelsDir, model)
    
    console.log(`Baixando ${model}...`)
    await downloadFile(url, dest)
    console.log(`${model} baixado com sucesso!`)
  }
}

downloadModels().catch(console.error) 