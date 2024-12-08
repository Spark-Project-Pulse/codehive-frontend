export const getLanguageFromFilename = (filename: string | null): string => {
  if (!filename) return 'plaintext' // Default to plaintext if filename is null
  const extension = filename.split('.').pop()
  switch (extension) {
    // Web development
    case 'html':
    case 'htm':
      return 'html'
    case 'css':
      return 'css'
    case 'scss':
    case 'sass':
      return 'scss'
    case 'js':
      return 'javascript'
    case 'jsx':
      return 'javascript'
    case 'ts':
      return 'typescript'
    case 'tsx':
      return 'typescript'
    case 'json':
      return 'json'
    case 'xml':
    case 'xsl':
    case 'xsd':
      return 'xml'

    // Backend programming
    case 'py':
      return 'python'
    case 'java':
      return 'java'
    case 'cs':
      return 'csharp'
    case 'cpp':
    case 'cc':
    case 'cxx':
      return 'cpp'
    case 'c':
      return 'c'
    case 'go':
      return 'go'
    case 'rs':
      return 'rust'
    case 'php':
      return 'php'
    case 'rb':
      return 'ruby'
    case 'kt':
    case 'kts':
      return 'kotlin'
    case 'swift':
      return 'swift'

    // Shell and scripting
    case 'sh':
    case 'bash':
      return 'shell'
    case 'bat':
    case 'cmd':
      return 'bat'
    case 'ps1':
      return 'powershell'

    // Data and configuration
    case 'sql':
      return 'sql'
    case 'yaml':
    case 'yml':
      return 'yaml'
    case 'toml':
      return 'toml'
    case 'ini':
      return 'ini'
    case 'env':
      return 'dotenv'
    case 'csv':
      return 'plaintext'
    case 'tsv':
      return 'plaintext'

    // Markdown and documentation
    case 'md':
    case 'markdown':
      return 'markdown'
    case 'rst':
      return 'plaintext'

    // Others
    case 'dart':
      return 'dart'
    case 'scala':
      return 'scala'
    case 'lua':
      return 'lua'
    case 'r':
      return 'r'
    case 'pl':
    case 'pm':
      return 'perl'
    case 'asm':
      return 'assembly'
    case 'pas':
      return 'pascal'
    case 'clj':
    case 'cljs':
    case 'cljc':
      return 'clojure'
    case 'el':
    case 'lisp':
      return 'lisp'
    case 'ex':
    case 'exs':
      return 'elixir'

    // Default fallback
    default:
      return 'plaintext' // Default language
  }
}
