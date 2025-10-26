"use client"

// ============================================================================
// BROWSER-BASED CODE EXECUTION ENGINE
// Supports: Python, JavaScript, C, C++, Java
// ============================================================================

// Execution result interface
export interface ExecutionResult {
  success: boolean
  output: string
  error: string | null
  executionTime: number
  testResults?: TestResult[]
}

export interface TestResult {
  passed: boolean
  input: string
  expectedOutput: string
  actualOutput: string
  error?: string
}

// ============================================================================
// ALL LANGUAGES NOW USE EXTERNAL API (Piston)
// This provides consistent, reliable execution across all languages
// ============================================================================

async function executeViaAPI(code: string, language: string, input: string = ''): Promise<ExecutionResult> {
  const startTime = Date.now()

  try {
    const response = await fetch('/api/execute-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        language,
        input,
      }),
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const result = await response.json()
    const executionTime = Date.now() - startTime

    return {
      success: result.success || false,
      output: result.output || '',
      error: result.error || null,
      executionTime: result.executionTime || executionTime,
    }
  } catch (error: any) {
    const executionTime = Date.now() - startTime
    return {
      success: false,
      output: '',
      error: error.message || 'API execution failed',
      executionTime,
    }
  }
}

async function executePythonCode(code: string, input: string = ''): Promise<ExecutionResult> {
  return executeViaAPI(code, 'python', input)
}

async function executeJavaScriptCode(code: string, input: string = ''): Promise<ExecutionResult> {
  return executeViaAPI(code, 'javascript', input)
}

async function executeCCode(code: string, input: string = ''): Promise<ExecutionResult> {
  return executeViaAPI(code, 'c', input)
}

async function executeCppCode(code: string, input: string = ''): Promise<ExecutionResult> {
  return executeViaAPI(code, 'cpp', input)
}

async function executeJavaCode(code: string, input: string = ''): Promise<ExecutionResult> {
  return executeViaAPI(code, 'java', input)
}

// ============================================================================
// TEST CASE EXECUTION
// ============================================================================

export async function executeWithTestCases(
  code: string,
  language: string,
  testCases: Array<{ input: string; expectedOutput: string }>
): Promise<ExecutionResult> {
  const startTime = Date.now()
  const testResults: TestResult[] = []

  try {
    for (const testCase of testCases) {
      const result = await executeCode(code, language, testCase.input)
      
      const actualOutput = result.output.trim()
      const expectedOutput = testCase.expectedOutput.trim()
      const passed = actualOutput === expectedOutput && result.success

      testResults.push({
        passed,
        input: testCase.input,
        expectedOutput,
        actualOutput,
        error: result.error || undefined,
      })
    }

    const allPassed = testResults.every(t => t.passed)
    const passedCount = testResults.filter(t => t.passed).length
    const totalCount = testResults.length

    return {
      success: allPassed,
      output: `Test Results: ${passedCount}/${totalCount} passed`,
      error: allPassed ? null : `${totalCount - passedCount} test(s) failed`,
      executionTime: Date.now() - startTime,
      testResults,
    }
  } catch (error: any) {
    return {
      success: false,
      output: '',
      error: error.message || 'Test execution failed',
      executionTime: Date.now() - startTime,
      testResults,
    }
  }
}

// ============================================================================
// MAIN EXECUTION ROUTER
// ============================================================================

export async function executeCode(
  code: string,
  language: string,
  input: string = ''
): Promise<ExecutionResult> {
  const normalizedLang = language.toLowerCase().trim()

  switch (normalizedLang) {
    case 'python':
    case 'py':
      return executePythonCode(code, input)
    
    case 'javascript':
    case 'js':
    case 'node':
      return executeJavaScriptCode(code, input)
    
    case 'c':
      return executeCCode(code, input)
    
    case 'c++':
    case 'cpp':
      return executeCppCode(code, input)
    
    case 'java':
      return executeJavaCode(code, input)
    
    default:
      return {
        success: false,
        output: '',
        error: `Language "${language}" is not supported. Supported languages: Python, JavaScript, C, C++, Java`,
        executionTime: 0,
      }
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function getSupportedLanguages(): string[] {
  return ['Python', 'JavaScript', 'C', 'C++', 'Java']
}

export function isLanguageSupported(language: string): boolean {
  const supported = ['python', 'py', 'javascript', 'js', 'node', 'c', 'c++', 'cpp', 'java']
  return supported.includes(language.toLowerCase().trim())
}
