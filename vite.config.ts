import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

function aiMiddleware(apiKey: string, model: string) {
  return {
    name: 'oficioslab-ai-middleware',
    configureServer(server: any) {
      server.middlewares.use('/api/ai', async (req: any, res: any) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end(JSON.stringify({ error: 'Método no permitido' }))
          return
        }
        if (!apiKey) {
          res.statusCode = 503
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'AI_NOT_CONFIGURED' }))
          return
        }
        try {
          let raw = ''
          for await (const chunk of req) raw += chunk
          const body = JSON.parse(raw || '{}')
          const content: any[] = [{ type: 'input_text', text: body.prompt || '' }]
          if (body.imageDataUrl) content.push({ type: 'input_image', image_url: body.imageDataUrl })

          const response = await fetch('https://api.openai.com/v1/responses', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model,
              input: [{ role: 'user', content }]
            })
          })
          const data: any = await response.json()
          if (!response.ok) {
            res.statusCode = response.status
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: data?.error?.message || 'Error de OpenAI' }))
            return
          }
          const text = (data.output || [])
            .flatMap((item: any) => item.content || [])
            .filter((item: any) => item.type === 'output_text')
            .map((item: any) => item.text)
            .join('\n')
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ text: text || 'No se recibió texto del modelo.' }))
        } catch (error: any) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: error?.message || 'Error interno' }))
        }
      })
    }
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), aiMiddleware(env.OPENAI_API_KEY || '', env.OPENAI_MODEL || 'gpt-5.6-luna')],
  }
})
