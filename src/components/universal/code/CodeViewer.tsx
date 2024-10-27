import React, { useEffect, useState } from 'react'
import Prism from 'prismjs'
import 'prismjs/plugins/line-numbers/prism-line-numbers.js'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'
import { Button } from '@/components/ui/button'
import { MessageCirclePlus } from 'lucide-react'

interface CodeViewerProps {
  fileContent: string | null
  filename: string | null
  lineNumbers?: boolean
  language?: string
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  fileContent,
  filename,
  lineNumbers = true,
  language = 'javascript',
}) => {
  const [hoveredLine, setHoveredLine] = useState<number | null>(null)
  console.log(hoveredLine)

  useEffect(() => {
    Prism.highlightAll()
  }, [fileContent])

  const lines = fileContent ? fileContent.split('\n') : []

  return (
    <div className="overflow-hidden rounded-lg bg-gray-100 text-gray-900 shadow-lg dark:bg-gray-800 dark:text-white">
      {filename && (
        <div className="bg-gray-200 px-4 py-2 font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-300">
          {filename}
        </div>
      )}
      <div className="p-4">
        <pre
          className={`${lineNumbers && 'line-numbers'} overflow-auto rounded-md bg-white dark:bg-gray-900`}
        >
          {lines.map((line, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredLine(index)}
              onMouseLeave={() => setHoveredLine(null)}
              className="group relative flex"
            >
              {hoveredLine === index && (
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-0 -translate-x-0 transform"
                >
                  <MessageCirclePlus className="h-4 w-4" />
                </Button>
              )}
              {lineNumbers && (
                <span
                  className="bg-gray-100 pr-4 pl-12 text-gray-900 dark:bg-gray-800 dark:text-white"
                  style={{ userSelect: 'none' }}
                >
                  {index + 1}
                </span>
              )}
              <code
                className={`language-${language} flex-1`}
                style={{ whiteSpace: 'pre' }}
              >
                {line === '' ? '\n' : line}
              </code>
            </div>
          ))}
        </pre>
      </div>
    </div>
  )
}
