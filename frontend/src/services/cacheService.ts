const CACHE_NAME = 'face-models-cache-v1';
const MODEL_FILES = [
  '/models/face_landmark_68_model-shard1',
  '/models/face_landmark_68_model-weights_manifest.json',
  '/models/face_recognition_model-shard1',
  '/models/face_recognition_model-shard2',
  '/models/face_recognition_model-weights_manifest.json',
  '/models/ssd_mobilenetv1_model-shard1',
  '/models/ssd_mobilenetv1_model-shard2',
  '/models/ssd_mobilenetv1_model-weights_manifest.json'
];

export async function cacheModels(): Promise<void> {
  try {
    const cache = await caches.open(CACHE_NAME);
    const cachedFiles = await cache.keys();
    const cachedUrls = cachedFiles.map(file => file.url);

    // Verifica quais arquivos precisam ser baixados
    const filesToCache = MODEL_FILES.filter(file => {
      const fullUrl = new URL(file, window.location.origin).href;
      return !cachedUrls.includes(fullUrl);
    });

    if (filesToCache.length === 0) {
      console.log('Todos os modelos já estão em cache');
      return;
    }

    console.log('Iniciando cache dos modelos...');
    await Promise.all(
      filesToCache.map(async file => {
        try {
          const response = await fetch(file);
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          await cache.put(file, response);
          console.log(`Modelo ${file} armazenado em cache`);
        } catch (error) {
          console.error(`Erro ao armazenar ${file} em cache:`, error);
          throw error;
        }
      })
    );
    console.log('Cache dos modelos concluído');
  } catch (error) {
    console.error('Erro ao gerenciar cache dos modelos:', error);
    throw error;
  }
}

export async function clearModelsCache(): Promise<void> {
  try {
    await caches.delete(CACHE_NAME);
    console.log('Cache dos modelos limpo');
  } catch (error) {
    console.error('Erro ao limpar cache dos modelos:', error);
    throw error;
  }
}

export async function updateModelsCache(): Promise<void> {
  try {
    await clearModelsCache();
    await cacheModels();
    console.log('Cache dos modelos atualizado');
  } catch (error) {
    console.error('Erro ao atualizar cache dos modelos:', error);
    throw error;
  }
} 