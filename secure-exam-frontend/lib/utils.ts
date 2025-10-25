import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Constants for retry and timeout configuration
export const RETRY_CONFIG = {
  MAX_RETRIES: 2,
  MIN_QUESTIONS_TO_START: 3,
  TIMEOUT_MS: 60000, // Increased to 60 seconds for AI API calls
  INITIAL_BACKOFF_MS: 1000,
} as const

// Exponential backoff utility
export function getBackoffDelay(attempt: number): number {
  return RETRY_CONFIG.INITIAL_BACKOFF_MS * Math.pow(2, attempt)
}

// Fetch with retry and exponential backoff for SSE streams
export async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries: number = RETRY_CONFIG.MAX_RETRIES
): Promise<Response> {
  let lastError: Error | null = null
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), RETRY_CONFIG.TIMEOUT_MS)
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      })
      
      clearTimeout(timeoutId)
      
      if (response.ok) {
        return response
      }
      
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      
      if (attempt < maxRetries) {
        const delay = getBackoffDelay(attempt)
        if (process.env.NODE_ENV !== 'production') {
          console.log(`⏳ Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`)
        }
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
  
  throw lastError || new Error('Fetch failed after retries')
}

// Structured logger with context
export interface LogContext {
  requestId?: string
  section?: string
  attempt?: number
  event?: string
  [key: string]: any
}

export function createLogger(baseContext: LogContext = {}) {
  const log = (level: 'info' | 'warn' | 'error', message: string, context: LogContext = {}) => {
    // Only log in development or for errors
    if (process.env.NODE_ENV === 'production' && level !== 'error') {
      return
    }
    
    const fullContext = { ...baseContext, ...context }
    const contextStr = Object.entries(fullContext)
      .filter(([k]) => k !== 'timestamp') // Exclude timestamp from output
      .map(([k, v]) => `${k}=${v}`)
      .join(' ')
    
    const prefix = level === 'error' ? '❌' : level === 'warn' ? '⚠️' : '📝'
    const requestId = fullContext.requestId || 'UNKNOWN'
    console[level](`${prefix} [${requestId}] ${message}${contextStr ? ' | ' + contextStr : ''}`)
  }
  
  return {
    info: (message: string, context?: LogContext) => log('info', message, context),
    warn: (message: string, context?: LogContext) => log('warn', message, context),
    error: (message: string, context?: LogContext) => log('error', message, context),
  }
}

// Normalize and trim output for comparison
export function normalizeOutput(output: string): string {
  return output
    .trim()
    .replace(/\r\n/g, '\n') // Normalize line endings
    .replace(/\s+$/gm, '') // Remove trailing spaces from each line
}

// Sanitize test case input
export function sanitizeTestInput(input: string): string {
  // Ensure input ends with newline if it doesn't already
  return input.endsWith('\n') ? input : input + '\n'
}
