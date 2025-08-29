import React, { useState } from 'react';
import { RichTextEditor } from './RichTextEditor';
import RichTextEditorV2 from './RichTextEditorV2';

export const RichTextEditorDemo: React.FC = () => {
  const [content1, setContent1] = useState('');
  const [content2, setContent2] = useState('');

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Rich Text Editor Comparison</h1>
        <p className="text-gray-600">Compare the original RichTextEditor with the new V2 version</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Original RichTextEditor */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Original RichTextEditor</h2>
          <p className="text-sm text-gray-600 mb-4">
            Full-featured editor with formatting toolbar, undo/redo, lists, and more.
          </p>
          
          <RichTextEditor
            value={content1}
            onChange={(content, formattedContent) => {
              setContent1(content);
              console.log('Original Editor - Content:', content);
              console.log('Original Editor - Formatted Content:', formattedContent);
            }}
            placeholder="Type here to test the original editor..."
            className="w-full"
            rows={8}
          />
          
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Content Preview:</h3>
            <div className="text-sm text-gray-600 whitespace-pre-wrap">
              {content1 || 'No content yet...'}
            </div>
          </div>
        </div>

        {/* New RichTextEditorV2 */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">RichTextEditor V2</h2>
          <p className="text-sm text-gray-600 mb-4">
            Simplified editor with improved Enter key handling and better block structure.
          </p>
          
          <RichTextEditorV2 />
          
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Features:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Better Enter key behavior (new paragraphs)</li>
              <li>• Shift+Enter for soft line breaks</li>
              <li>• Proper block structure</li>
              <li>• Simplified and focused</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Key Differences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Original RichTextEditor</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Full formatting toolbar</li>
              <li>• Undo/Redo functionality</li>
              <li>• List creation and management</li>
              <li>• Font size and family controls</li>
              <li>• Formatted content extraction</li>
              <li>• History tracking</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-2">RichTextEditor V2</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Simplified interface</li>
              <li>• Better Enter key handling</li>
              <li>• Proper block structure</li>
              <li>• Word-like behavior</li>
              <li>• Focused on core functionality</li>
              <li>• Easier to customize</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}; 