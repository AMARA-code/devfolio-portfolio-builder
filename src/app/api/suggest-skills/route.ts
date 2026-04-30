import Groq from 'groq-sdk' 
import { NextResponse } from 'next/server' 
 
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY }) 
 
export async function POST(request: Request) { 
  try { 
    const { skill } = await request.json() 
    if (!skill) return NextResponse.json({ skills: [] }) 
    const result = await groq.chat.completions.create({ 
      model: 'llama-3.1-8b-instant', 
      messages: [{ role: 'user', content: 'Return ONLY a JSON array of 5 skill names related to: ' + skill + '. Example: ["React","TypeScript","Node.js","CSS","Git"]. No explanation.' }], 
      max_tokens: 100, 
    }) 
    const text = result.choices[0].message.content || '[]' 
    const clean = text.replace(/```json|```/g, '').trim() 
    try { return NextResponse.json({ skills: JSON.parse(clean) }) } catch { return NextResponse.json({ skills: [] }) } 
  } catch (error) { 
    console.error(error) 
    return NextResponse.json({ skills: [] }, { status: 500 }) 
  } 
} 
