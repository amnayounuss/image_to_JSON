import { useState, useCallback } from 'react';
import { createWorker } from 'tesseract.js';
import ISO6391 from 'iso-639-1';
import { ImageUploader } from './components/ImageUploader';
import { TranslationPreview } from './components/TranslationPreview';
import { ExtractedText, TranslationEntry } from './types';
import {
  processExtractedText,
  generateJsonFile,
  downloadJson,
} from './utils/textProcessing';
import { FileText } from 'lucide-react';

function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [entries, setEntries] = useState<TranslationEntry[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const handleImageUpload = useCallback(async (file: File) => {
    setIsProcessing(true);
    try {
      const worker = await createWorker();
      await worker.loadLanguage(selectedLanguage); // Load the appropriate language
      await worker.initialize(selectedLanguage);

      const { data: { text, confidence } } = await worker.recognize(file);

      if (text && confidence) {
        const extractedText: ExtractedText = { text, confidence };
        const processedEntries = processExtractedText(extractedText);
        setEntries(processedEntries);
      }

      await worker.terminate();
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Error processing image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [selectedLanguage]);

  const handleDownload = useCallback(() => {
    const jsonData = generateJsonFile(entries);
    downloadJson(jsonData, `translations_${selectedLanguage}.json`);
  }, [entries, selectedLanguage]);

  const languages = ISO6391.getAllCodes().map(code => ({
    code,
    name: ISO6391.getName(code),
  }));

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <FileText className="mx-auto h-12 w-12 text-blue-500" />
          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            OCR Translation Generator
          </h1>
          <p className="mt-2 text-gray-600">
            Extract text from images and generate i18n JSON files
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Language
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {languages.map(({ code, name }) => (
                <option key={code} value={code}>
                  {name} ({code})
                </option>
              ))}
            </select>
          </div>

          <ImageUploader
            onImageUpload={handleImageUpload}
            isProcessing={isProcessing}
          />

          <TranslationPreview
            entries={entries}
            onDownload={handleDownload}
            selectedLanguage={selectedLanguage}
          />
        </div>
      </div>
    </div>
  );
}

export default App;