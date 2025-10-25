import { NextRequest, NextResponse } from "next/server"
import { normalizeOutput } from "@/lib/utils"

interface ExecuteCodeRequest {
  code: string
  language: string
  input?: string
}

// Piston API endpoint (free and open-source code execution API)
const PISTON_API_URL = "https://emkc.org/api/v2/piston"

// Language mapping for Piston API
const LANGUAGE_MAP: Record<string, { language: string; version: string }> = {
  python: { language: "python", version: "3.10.0" },
  javascript: { language: "javascript", version: "18.15.0" },
  js: { language: "javascript", version: "18.15.0" },
  java: { language: "java", version: "15.0.2" },
  c: { language: "c", version: "10.2.0" },
  cpp: { language: "c++", version: "10.2.0" },
  "c++": { language: "c++", version: "10.2.0" },
}

export async function POST(request: NextRequest) {
  try {
    const { code, language, input = "" }: ExecuteCodeRequest = await request.json()

    if (!code || !language) {
      return NextResponse.json(
        { error: "Code and language are required" },
        { status: 400 }
      )
    }

    const result = await executeCode(code, language, input)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Execution error:", error)
    return NextResponse.json(
      { error: "Failed to execute code", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

async function executeCode(code: string, language: string, input: string) {
  const startTime = Date.now()

  try {
    // Get language configuration for Piston API
    const langConfig = LANGUAGE_MAP[language.toLowerCase()]
    if (!langConfig) {
      throw new Error(`Unsupported language: ${language}`)
    }

    // Prepare the request payload for Piston API
    const payload = {
      language: langConfig.language,
      version: langConfig.version,
      files: [
        {
          name: getFileName(language),
          content: code,
        },
      ],
      stdin: input,
      args: [],
      compile_timeout: 10000,
      run_timeout: 3000,
      compile_memory_limit: -1,
      run_memory_limit: -1,
    }

    // Execute code via Piston API
    const response = await fetch(`${PISTON_API_URL}/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`Piston API error: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()
    const executionTime = Date.now() - startTime

    // Check for compilation errors
    if (result.compile && result.compile.code !== 0) {
      return {
        success: false,
        output: "",
        error: result.compile.stderr || result.compile.output || "Compilation failed",
        executionTime,
      }
    }

    // Check for runtime errors
    if (result.run && result.run.code !== 0 && result.run.signal) {
      return {
        success: false,
        output: result.run.stdout || "",
        error: result.run.stderr || `Program terminated with signal: ${result.run.signal}`,
        executionTime,
      }
    }

    // Success case
    const output = result.run?.stdout || result.run?.output || ""
    const error = result.run?.stderr || null

    return {
      success: true,
      output: normalizeOutput(output),
      executionTime,
      error: error && !output ? error : null,
    }
  } catch (error: any) {
    const executionTime = Date.now() - startTime
    return {
      success: false,
      output: "",
      error: error.message || "Execution failed",
      executionTime,
    }
  }
}

// Helper function to get appropriate filename for each language
function getFileName(language: string): string {
  const fileNames: Record<string, string> = {
    python: "main.py",
    javascript: "main.js",
    js: "main.js",
    java: "Main.java",
    c: "main.c",
    cpp: "main.cpp",
    "c++": "main.cpp",
  }
  return fileNames[language.toLowerCase()] || "main.txt"
}
