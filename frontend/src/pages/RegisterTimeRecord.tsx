import { useState, useCallback, useRef } from 'react';
import Webcam from 'react-webcam';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../lib/axios';
import { CameraIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface Project {
  id: string;
  name: string;
}

const videoConstraints = {
  width: 720,
  height: 480,
  facingMode: "user"
};

export function RegisterTimeRecord() {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');
  const webcamRef = useRef<Webcam | null>(null);

  // Busca a lista de projetos do usuário
  const { data: projects, isLoading: isLoadingProjects } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await api.get('/projects');
      return response.data;
    }
  });

  // Mutation para registrar o ponto
  const { mutate: registerTimeRecord, isLoading: isRegistering } = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.post('/time-records', formData);
      return response.data;
    },
    onSuccess: () => {
      setIsCameraActive(false);
      setSelectedProject('');
      alert('Ponto registrado com sucesso!');
    },
    onError: (error) => {
      alert('Erro ao registrar ponto. Tente novamente.');
      console.error('Erro:', error);
    }
  });

  const handleStartCapture = useCallback(() => {
    if (!selectedProject) {
      alert('Selecione um projeto');
      return;
    }
    setIsCameraActive(true);
  }, [selectedProject]);

  const handleCapture = useCallback(async () => {
    if (!webcamRef.current || !selectedProject) return;

    try {
      setIsCapturing(true);
      
      // Captura a imagem da webcam
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) {
        throw new Error('Não foi possível capturar a imagem');
      }

      // Converte a imagem base64 para blob
      const response = await fetch(imageSrc);
      const blob = await response.blob();

      // Cria o FormData com a imagem e dados do registro
      const formData = new FormData();
      formData.append('image', blob, 'face.jpg');
      formData.append('projectId', selectedProject);
      formData.append('timestamp', new Date().toISOString());
      formData.append('type', 'ENTRY'); // ou 'EXIT' dependendo do contexto

      // Envia o registro
      registerTimeRecord(formData);
    } catch (error) {
      console.error('Erro ao capturar imagem:', error);
      alert('Erro ao capturar imagem. Tente novamente.');
    } finally {
      setIsCapturing(false);
    }
  }, [webcamRef, selectedProject, registerTimeRecord]);

  if (isLoadingProjects) {
    return (
      <div className="flex items-center justify-center h-full">
        <ArrowPathIcon className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Registrar Ponto
          </h3>
          
          <div className="mt-6">
            <label htmlFor="project" className="block text-sm font-medium text-gray-700">
              Projeto
            </label>
            <select
              id="project"
              name="project"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              disabled={isCameraActive}
            >
              <option value="">Selecione um projeto</option>
              {projects?.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          {!isCameraActive ? (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={handleStartCapture}
                disabled={!selectedProject}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CameraIcon className="mr-2 h-5 w-5" />
                Iniciar Câmera
              </button>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <div className="relative">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  className="w-full rounded-lg shadow-lg"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 border-4 border-white rounded-full opacity-50" />
                </div>
              </div>

              <div className="flex space-x-4 justify-center">
                <button
                  type="button"
                  onClick={handleCapture}
                  disabled={isCapturing || isRegistering}
                  className="flex items-center justify-center text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCapturing || isRegistering ? (
                    <>
                      <ArrowPathIcon className="mr-2 h-5 w-5 animate-spin" />
                      Registrando...
                    </>
                  ) : (
                    <>
                      <CameraIcon className="mr-2 h-5 w-5" />
                      Registrar Ponto
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsCameraActive(false)}
                  disabled={isCapturing || isRegistering}
                  className="flex items-center justify-center text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          <div className="mt-6">
            <div className="rounded-md bg-blue-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Instruções
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Selecione o projeto para o qual deseja registrar o ponto</li>
                      <li>Posicione seu rosto dentro do círculo</li>
                      <li>Mantenha uma boa iluminação</li>
                      <li>Evite usar óculos escuros ou máscaras</li>
                      <li>Mantenha uma expressão neutra</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
