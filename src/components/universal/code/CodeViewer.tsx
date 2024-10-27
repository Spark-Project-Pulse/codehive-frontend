interface CodeViewerProps {
  fileContent: string | null
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  fileContent
}) => {
  return (
    <div className="rounded-lg bg-gray-200 p-4">
      <pre className="whitespace-pre-wrap">{fileContent}</pre>
    </div>
  )
}
