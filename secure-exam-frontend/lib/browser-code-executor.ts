"use client"

// Browser-based code execution using Pyodide (Python in WebAssembly)
let pyodideInstance: any = null
let pyodideLoading: Promise<any> | null = null

export async function loadPyodide() {
  if (pyodideInstance) return pyodideInstance
  if (pyodideLoading) return pyodideLoading

  pyodideLoading = (async () => {
    try {
      // @ts-ignore
      const { loadPyodide: load } = await import('pyodide')
      pyodideInstance = await load({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/',
      })
      console.log('✅ Pyodide loaded successfully')
      return pyodideInstance
    } catch (error) {
      console.error('❌ Failed to load Pyodide:', error)
      throw error
    }
  })()

  return pyodideLoading
}

export async function executePythonCode(code: string, input: string = ''): Promise<{
  success: boolean
  output: string
  error: string | null
  executionTime: number
}> {
  const startTime = Date.now()

  try {
    const pyodide = await loadPyodide()

    // Prepare code with input handling
    const wrappedCode = `
import sys
from io import StringIO

# Set up input
input_data = """${input.replace(/"/g, '\\"')}"""
sys.stdin = StringIO(input_data)

# Capture output
output_buffer = StringIO()
sys.stdout = output_buffer
sys.stderr = output_buffer

try:
${code.split('\n').map(line => '    ' + line).join('\n')}
except Exception as e:
    print(str(e), file=sys.stderr)

# Get output
result = output_buffer.getvalue()
result
`

    const result = await pyodide.runPythonAsync(wrappedCode)
    const executionTime = Date.now() - startTime

    return {
      success: true,
      output: String(result || '').trim(),
      error: null,
      executionTime,
    }
  } catch (error: any) {
    const executionTime = Date.now() - startTime
    return {
      success: false,
      output: '',
      error: error.message || 'Execution failed',
      executionTime,
    }
  }
}

// JavaScript execution (runs directly in browser)
export async function executeJavaScriptCode(code: string, input: string = ''): Promise<{
  success: boolean
  output: string
  error: string | null
  executionTime: number
}> {
  const startTime = Date.now()

  try {
    // Create a sandboxed environment
    const logs: string[] = []
    const customConsole = {
      log: (...args: any[]) => logs.push(args.map(String).join(' ')),
      error: (...args: any[]) => logs.push(args.map(String).join(' ')),
    }

    // Prepare input as an array of lines
    const inputLines = input.split('\n').filter(line => line.trim())
    let inputIndex = 0
    const customInput = () => {
      if (inputIndex < inputLines.length) {
        return inputLines[inputIndex++]
      }
      return ''
    }

    // Create function with custom console and input
    const func = new Function('console', 'input', code)
    func(customConsole, customInput)

    const executionTime = Date.now() - startTime

    return {
      success: true,
      output: logs.join('\n'),
      error: null,
      executionTime,
    }
  } catch (error: any) {
    const executionTime = Date.now() - startTime
    return {
      success: false,
      output: '',
      error: error.message || 'Execution failed',
      executionTime,
    }
  }
}

// Main execution function that routes to appropriate executor
export async function executeCode(
  code: string,
  language: string,
  input: string = ''
): Promise<{
  success: boolean
  output: string
  error: string | null
  executionTime: number
}> {
  switch (language.toLowerCase()) {
    case 'python':
      return executePythonCode(code, input)
    
    case 'javascript':
    case 'js':
      return executeJavaScriptCode(code, input)
    
    default:
      return {
        success: false,
        output: '',
        error: `Language "${language}" is not supported in browser execution. Currently supported: Python, JavaScript`,
        executionTime: 0,
      }
  }
}
