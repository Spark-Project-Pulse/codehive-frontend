import React, { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { FileEdit, Eye } from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import rehypePrism from "rehype-prism-plus";
import { useTheme } from 'next-themes';
import MDEditor from '@uiw/react-md-editor';

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState('');
  const [activeTab, setActiveTab] = useState('edit');
  
  const { resolvedTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);


  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const loadTheme = async () => {
      if (!resolvedTheme) {
        return
      }
      if (resolvedTheme === "dark") {
        await import("prismjs/themes/prism-tomorrow.css");
      } else {
        await import("prismjs/themes/prism.css");
      }
    }

    void loadTheme()
  }, [resolvedTheme]);

  const handleEditorChange = (value?: string) => {
    if (value !== undefined) {
      setMarkdown(value);
    }
  };
  

  if (!isMounted) return null;

  return (
    <Card className="w-full max-w-4xl mx-auto p-4">
      {/* <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="edit" className="flex items-center gap-2">
            <FileEdit className="w-4 h-4" />
            Edit
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="mt-0">
          <textarea
            value={markdown}
            onChange={handleChange}
            className="w-full min-h-96 p-4 font-mono text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your markdown here..."
          />
        </TabsContent>

        <TabsContent value="preview" className="mt-0">
          <div className={`w-full min-h-96 p-4 border rounded-md prose prose-sm max-w-none ${
              resolvedTheme === 'dark' ? 'dark' : ''
            }`}>
            <Markdown
              // rehypePlugins={[rehypeHighlight]}
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypePrism]}
            >
              {markdown}
            </Markdown>
          </div>
        </TabsContent>
      </Tabs> */}
      <MDEditor
        value={markdown}
        onChange={handleEditorChange}
        height={300}
        preview="edit"  // You can also use 'preview' for preview mode
        highlightEnable={false}
      />
    </Card>
  );
};

export default MarkdownEditor;