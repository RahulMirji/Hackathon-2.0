"use client"

import { useEffect, useRef } from "react"

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language: string
  placeholder?: string
}

export function CodeEditor({ value, onChange, language, placeholder }: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const lineNumbersRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    updateLineNumbers()
  }, [value])

  const updateLineNumbers = () => {
    if (!lineNumbersRef.current || !textareaRef.current) return
    
    const lines = value.split('\n').length
    const lineNumbersHtml = Array.from({ length: lines }, (_, i) => i + 1)
      .map(num => `<div class="line-number">${num}</div>`)
      .join('')
    
    lineNumbersRef.current.innerHTML = lineNumbersHtml
  }

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.currentTarget.scrollTop
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const start = e.currentTarget.selectionStart
      const end = e.currentTarget.selectionEnd
      const newValue = value.substring(0, start) + '  ' + value.substring(end)
      onChange(newValue)
      
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2
        }
      }, 0)
    }
  }

  return (
    <div className="relative flex border-2 border-border rounded-lg overflow-hidden bg-[#1e1e1e] dark:bg-[#1e1e1e] h-[600px]">
      {/* Line Numbers */}
      <div
        ref={lineNumbersRef}
        className="flex flex-col text-right pr-3 pl-3 py-4 bg-[#1e1e1e] text-[#858585] font-mono text-sm select-none overflow-hidden border-r border-[#3e3e3e]"
        style={{ minWidth: '50px' }}
      />
      
      {/* Code Editor */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        spellCheck={false}
        className="flex-1 p-4 bg-[#1e1e1e] text-[#d4d4d4] font-mono text-sm focus:outline-none resize-none leading-6 placeholder-[#6a6a6a]"
        style={{
          tabSize: 2,
          lineHeight: '1.5rem',
        }}
      />
      
      <style jsx>{`
        .line-number {
          height: 1.5rem;
          line-height: 1.5rem;
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  )
}
