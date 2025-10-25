import { NextResponse } from "next/server"

// Use environment variables (same as main API)
const API_URL = process.env.AI_API_URL || ""
const API_KEY = process.env.AI_API_KEY || ""
const MODEL = process.env.AI_MODEL || ""

export async function GET() {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({
      success: false,
      error: "Test endpoint disabled in production"
    }, { status: 403 })
  }
  
  console.log("🧪 [TEST] Testing AI API without streaming...")
  
  if (!API_URL || !API_KEY || !MODEL) {
    return NextResponse.json({
      success: false,
      error: "Missing AI configuration. Check environment variables."
    }, { status: 500 })
  }
  
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "system",
            content: "You are a JSON generator. Return ONLY valid JSON, no markdown."
          },
          {
            role: "user",
            content: 'Generate 1 simple coding question as JSON: [{"id":1,"title":"Test","description":"Test question"}]'
          }
        ],
        temperature: 0.3,
        stream: false,
      }),
    })

    console.log("📥 [TEST] Response status:", response.status)

    const text = await response.text()
    console.log("📄 [TEST] Response length:", text.length)

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        status: response.status,
        bodyLength: text.length
      })
    }

    const data = JSON.parse(text)
    console.log("✅ [TEST] Parsed response successfully")

    return NextResponse.json({
      success: true,
      data
    })
  } catch (error) {
    console.error("❌ [TEST] Error:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
