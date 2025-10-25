import { NextRequest, NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { tmpdir } from "os"
import { normalizeOutput, sanitizeTestInput } from "@/lib/utils"

const execAsync = promisify(exec)

interface ExecuteCodeRequest {
  code: string
  language: string
  input?: string
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
  const tempDir = join(tmpdir(), `code-exec-${Date.now()}-${Math.random().toString(36).substring(7)}`)
  await mkdir(tempDir, { recursive: true })

  try {
    let command: string
    let filePath: string
    let inputFilePath: string | null = null

    // Create input file if input is provided
    if (input) {
      inputFilePath = join(tempDir, "input.txt")
      // Sanitize input to ensure it ends with newline
      const sanitizedInput = sanitizeTestInput(input)
      await writeFile(inputFilePath, sanitizedInput)
    }

    switch (language.toLowerCase()) {
      case "python":
        filePath = join(tempDir, "main.py")
        await writeFile(filePath, code)
        // Try python first (Windows), then python3 (Linux/Mac)
        const pythonCmd = process.platform === 'win32' ? 'python' : 'python3'
        command = inputFilePath 
          ? `${pythonCmd} "${filePath}" < "${inputFilePath}"`
          : `${pythonCmd} "${filePath}"`
        break

      case "java":
        filePath = join(tempDir, "Main.java")
        await writeFile(filePath, code)
        command = inputFilePath
          ? `cd "${tempDir}" && javac Main.java && java Main < "${inputFilePath}"`
          : `cd "${tempDir}" && javac Main.java && java Main`
        break

      case "cpp":
      case "c++":
        filePath = join(tempDir, "main.cpp")
        await writeFile(filePath, code)
        const cppExec = join(tempDir, "main")
        command = inputFilePath
          ? `g++ "${filePath}" -o "${cppExec}" && "${cppExec}" < "${inputFilePath}"`
          : `g++ "${filePath}" -o "${cppExec}" && "${cppExec}"`
        break

      case "c":
        filePath = join(tempDir, "main.c")
        await writeFile(filePath, code)
        const cExec = join(tempDir, "main")
        command = inputFilePath
          ? `gcc "${filePath}" -o "${cExec}" && "${cExec}" < "${inputFilePath}"`
          : `gcc "${filePath}" -o "${cExec}" && "${cExec}"`
        break

      default:
        throw new Error(`Unsupported language: ${language}`)
    }

    const startTime = Date.now()
    const { stdout, stderr } = await execAsync(command, {
      timeout: 10000, // 10 second timeout
      maxBuffer: 1024 * 1024, // 1MB buffer
      cwd: tempDir,
    })
    const executionTime = Date.now() - startTime

    // Normalize output for consistent comparison
    const normalizedOutput = normalizeOutput(stdout || stderr)

    return {
      success: true,
      output: normalizedOutput,
      executionTime,
      error: stderr && !stdout ? stderr : null,
    }
  } catch (error: any) {
    let errorMessage = error.stderr || error.message || "Execution failed"
    
    // Provide helpful error message if Python is not found
    if (language.toLowerCase() === 'python' && errorMessage.includes('not found')) {
      errorMessage = "Python is not installed or not in PATH. Please install Python from python.org and add it to your system PATH."
    }
    
    return {
      success: false,
      output: "",
      error: errorMessage,
      executionTime: 0,
    }
  } finally {
    // Cleanup temp files
    try {
      const cleanupCmd = process.platform === 'win32' 
        ? `rmdir /s /q "${tempDir}"`
        : `rm -rf "${tempDir}"`
      await execAsync(cleanupCmd)
    } catch (cleanupError) {
      console.error("Cleanup error:", cleanupError)
    }
  }
}
