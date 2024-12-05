import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { FileEdit, Eye } from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState('');
  const [activeTab, setActiveTab] = useState('edit');
  
  const handleEditorChange = (value?: string) => {
    if (value !== undefined) {
      setMarkdown(value);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="edit" className="flex items-center gap-2">
            <FileEdit className="w-4 h-4" />
            Edit
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Previewd
          </TabsTrigger>
        </TabsList>

        {/* Edit Tab */}
        <TabsContent value="edit" className="mt-0">
          <MDEditor
            value={markdown}
            onChange={handleEditorChange}
            height={300}
            preview="edit"
            highlightEnable={false}
            hideToolbar
          />
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className="mt-0">
          <MDEditor
            value={markdown}
            height={300}
            preview="preview"
            hideToolbar
          />
        </TabsContent>
      </Tabs>

    </Card>
  );
};

export default MarkdownEditor;