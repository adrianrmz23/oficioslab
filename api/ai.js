export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' })
  const apiKey = process.env.OPENAI_API_KEY
  const model = process.env.OPENAI_MODEL || 'gpt-5.6-luna'
  if (!apiKey) return res.status(503).json({ error: 'AI_NOT_CONFIGURED' })

  try {
    const { prompt = '', imageDataUrl } = req.body || {}
    const content = [{ type: 'input_text', text: prompt }]
    if (imageDataUrl) content.push({ type: 'input_image', image_url: imageDataUrl })
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, input: [{ role: 'user', content }] })
    })
    const data = await response.json()
    if (!response.ok) return res.status(response.status).json({ error: data?.error?.message || 'Error de OpenAI' })
    const text = (data.output || [])
      .flatMap(item => item.content || [])
      .filter(item => item.type === 'output_text')
      .map(item => item.text)
      .join('\n')
    return res.status(200).json({ text: text || 'No se recibió texto del modelo.' })
  } catch (error) {
    return res.status(500).json({ error: error?.message || 'Error interno' })
  }
}
