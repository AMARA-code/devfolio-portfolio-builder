import Groq from 'groq-sdk' 
import { NextResponse } from 'next/server' 
 
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY }) 
 
export async function POST(request: Request) { 
  try { 
    const { keywords } = await request.json() 
    if (!keywords) return NextResponse.json({ bio: '' }) 
    const result = await groq.chat.completions.create({ 
      model: 'llama-3.1-8b-instant', 
      messages: [{ role: 'user', content: 'Write a 2-3 sentence professional developer bio for: ' + keywords }], 
      max_tokens: 150, 
    }) 
    const bio = result.choices[0].message.content 
    return NextResponse.json({ bio }) 
  } catch (error) { 
    console.error(error) 
    return NextResponse.json({ bio: '' }, { status: 500 }) 
  } 
} 
