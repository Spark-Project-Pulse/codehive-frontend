import React, { useEffect } from 'react'
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
  useEffect(() => {
    Prism.highlightAll()
  }, [fileContent])

  return (
    <div className="rounded-lg overflow-hidden shadow-lg bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white">
      {filename && (
        <div className="px-4 py-2 font-semibold bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
          {filename}
        </div>
      )}
      <div className="p-4">
        <pre className={`${lineNumbers && "line-numbers"} whitespace-pre-wrap rounded-md overflow-auto bg-white dark:bg-gray-900`}>
          <code className={`language-${language}`}>{fileContent}</code>
        </pre>
      </div>
    </div>
  )
}
