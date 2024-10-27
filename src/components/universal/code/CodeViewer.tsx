import React, { useEffect, useState } from 'react'
import Prism from 'prismjs'
import 'prismjs/plugins/line-numbers/prism-line-numbers.js'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'

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

  useEffect(() => {
    Prism.highlightAll()
  }, [fileContent])

  const lines = fileContent ? fileContent.split('\n') : []

  console.log(fileContent)

  console.log(lines)

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
              <code
                className={`language-${language} flex-1`}
                style={{ whiteSpace: 'pre' }}
              >
                {line === '' ? '\n' : line}
                </code>
              {hoveredLine === index && (
                <button
                  onClick={() => console.log(`Line ${index + 1}: ${line}`)} // replace with popover logic
                  className="ml-2 text-sm text-blue-500 opacity-0 transition-opacity hover:text-blue-700 group-hover:opacity-100"
                >
                  •••
                </button>
              )}
            </div>
          ))}
        </pre>
      </div>
    </div>
  )
}