import Groq from 'groq-sdk' 
import { NextResponse } from 'next/server' 
 
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY }) 
 
export async function POST(request: Request) { 
  try { 
    const { description } = await request.json() 
    if (!description) return NextResponse.json({ description: '' }) 
    const result = await groq.chat.completions.create({ 
      model: 'llama-3.1-8b-instant', 
      messages: [{ role: 'user', content: 'Rewrite this project description professionally in 2-3 sentences for a developer portfolio. No extra commentary: ' + description }], 
      max_tokens: 200, 
    }) 
    const enhanced = result.choices[0].message.content 
    return NextResponse.json({ description: enhanced }) 
  } catch (error) { 
    console.error(error) 
    return NextResponse.json({ description: '' }, { status: 500 }) 
  } 
} 
