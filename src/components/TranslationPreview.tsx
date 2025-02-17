import React, { useState } from 'react';
import { Download, Copy, Check } from 'lucide-react';
import { TranslationEntry } from '../types';
import ISO6391 from 'iso-639-1';
import { generateJsonFile } from '../utils/textProcessing';

interface TranslationPreviewProps {
  entries: TranslationEntry[];
  onDownload: () => void;
  selectedLanguage: string;
}

export const TranslationPreview: React.FC<TranslationPreviewProps> = ({
  entries,
  onDownload,
  selectedLanguage,
}) => {
  const [showJson, setShowJson] = useState(false);
  const [copied, setCopied] = useState(false);

  if (entries.length === 0) {
    return null;
  }

  const jsonData = generateJsonFile(entries);
  const formattedJson = JSON.stringify(jsonData, null, 2);

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(formattedJson);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          Extracted Text ({ISO6391.getName(selectedLanguage)})
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowJson(!showJson)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {showJson ? 'Show Table' : 'Show JSON'}
          </button>
          {showJson && (
            <button
              onClick={handleCopyJson}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy JSON
                </>
              )}
            </button>
          )}
          <button
            onClick={onDownload}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download JSON
          </button>
        </div>
      </div>
      <div className="bg-gray-50 rounded-lg p-4">
        {showJson ? (
          <pre className="text-sm overflow-x-auto whitespace-pre-wrap break-words font-mono bg-white p-4 rounded border border-gray-200">
            {formattedJson}
          </pre>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div className="font-medium text-gray-600">Key</div>
            <div className="font-medium text-gray-600">Value</div>
            {entries.map(({ key, value }, index) => (
              <React.Fragment key={index}>
                <div className="text-sm text-gray-500 break-all">{key}</div>
                <div className="text-sm break-all">{value}</div>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};