import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { FaceRecognition } from '../components/FaceRecognition'
import { useAuth } from '../hooks/useAuth'

export function TimeEntry() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [lastEntry, setLastEntry] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()

  // Carregar último registro de ponto do usuário
  useEffect(() => {
    async function loadLastEntry() {
      if (!user?.id) return

      try {
        const { data, error } = await supabase
          .from('time_entries')
          .select('*')
          .eq('user_id', user.id)
          .order('timestamp', { ascending: false })
          .limit(1)
          .single()

        if (error) throw error
        setLastEntry(data)
      } catch (err) {
        console.error('Erro ao carregar último registro:', err)
      }
    }

    loadLastEntry()
  }, [user?.id])

  // Carregar dados do usuário incluindo o face_encoding
  const [userFaceEncoding, setUserFaceEncoding] = useState<Float32Array>()
  
  useEffect(() => {
    async function loadUserFaceEncoding() {
      if (!user?.id) return

      try {
        const { data, error } = await supabase
          .from('users')
          .select('face_encoding')
          .eq('id', user.id)
          .single()

        if (error) throw error
        
        if (data?.face_encoding) {
          // Converter string base64 para Float32Array
          const buffer = Buffer.from(data.face_encoding, 'base64')
          setUserFaceEncoding(new Float32Array(buffer.buffer))
        }
      } catch (err) {
        console.error('Erro ao carregar face encoding:', err)
        setError('Erro ao carregar dados de reconhecimento facial')
      }
    }

    loadUserFaceEncoding()
  }, [user?.id])

  async function handleFaceCapture(faceData: { descriptor: Float32Array; matchScore?: number }) {
    if (!user?.id) return

    try {
      setLoading(true)
      setError(undefined)

      // Se não tiver face_encoding cadastrado, cadastrar
      if (!userFaceEncoding) {
        // Converter Float32Array para string base64
        const buffer = Buffer.from(faceData.descriptor.buffer)
        const base64 = buffer.toString('base64')

        const { error: updateError } = await supabase
          .from('users')
          .update({ face_encoding: base64 })
          .eq('id', user.id)

        if (updateError) throw updateError

        setUserFaceEncoding(faceData.descriptor)
        alert('Rosto cadastrado com sucesso!')
        return
      }

      // Verificar score de similaridade
      if (!faceData.matchScore || faceData.matchScore < 0.6) {
        setError('Rosto não reconhecido. Por favor, tente novamente.')
        return
      }

      // Registrar ponto
      const entryType = lastEntry?.entry_type === 'ENTRY' ? 'EXIT' : 'ENTRY'

      // Obter localização atual
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
      })

      const { error: createError } = await supabase
        .from('time_entries')
        .insert({
          user_id: user.id,
          entry_type: entryType,
          face_match_score: faceData.matchScore,
          location_latitude: position.coords.latitude,
          location_longitude: position.coords.longitude,
          device_info: navigator.userAgent
        })

      if (createError) throw createError

      alert(entryType === 'ENTRY' ? 'Entrada registrada com sucesso!' : 'Saída registrada com sucesso!')
      navigate('/dashboard')
    } catch (err) {
      console.error('Erro ao registrar ponto:', err)
      setError('Erro ao registrar ponto. Por favor, tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <main className="mx-auto w-full max-w-[640px] p-4 pb-8 lg:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Registro de Ponto
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {!userFaceEncoding
              ? 'Posicione seu rosto na câmera e clique em Capturar para cadastrar seu reconhecimento facial.'
              : 'Posicione seu rosto na câmera e clique em Capturar para registrar seu ponto.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-center text-red-700">
            {error}
          </div>
        )}

        <FaceRecognition
          onCapture={handleFaceCapture}
          referenceDescriptor={userFaceEncoding}
        />

        {lastEntry && (
          <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-4">
            <h2 className="font-medium text-gray-900">Último Registro</h2>
            <p className="mt-1 text-sm text-gray-500">
              {lastEntry.entry_type === 'ENTRY' ? 'Entrada' : 'Saída'} em{' '}
              {new Date(lastEntry.timestamp).toLocaleString('pt-BR')}
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
