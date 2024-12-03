import React, { useState } from 'react';
import { Header } from './components/Header';
import { SearchInput } from './components/SearchInput';
import { Sources } from './components/Sources';
import { Answer } from './components/Answer';
import { SimilarTopics } from './components/SimilarTopics';
import { QuestionDisplay } from './components/QuestionDisplay';
import { GeneratedImage } from './components/GeneratedImage';
import { searchGoogle, getAnswer, getSimilarTopics } from './services/api';
import { analyzeImage, detectObjects, explainCode, generateImage } from './services/huggingface';
import { Footer } from './components/Footer';
import { toast } from 'react-hot-toast';

// Define interfaces for better type safety
interface SearchResults {
  question: string;
  sources: Array<{ title: string; link: string; snippet: string }>;
  answer: string;
  similarTopics: string[];
}

interface FileAnalysisData {
  type: 'image' | 'code';
  content: string;
  metadata?: any;
}

interface GeneratedImageData {
  url: string;
  prompt: string;
}

const EXAMPLE_QUESTIONS = [
  "What's the future of brain-computer interfaces?",
  "Will quantum computing revolutionize cybersecurity?",
  "What are the most groundbreaking AI discoveries of 2024?"
];

function App() {
  const [loading, setLoading] = useState(false);
  const [promptValue, setPromptValue] = useState('');
  const [fileAnalysis, setFileAnalysis] = useState<FileAnalysisData | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImageData | null>(null);

  const handleSearch = async (query: string) => {
    setLoading(true);
    setPromptValue('');
    setGeneratedImage(null);
    
    try {
      if (query.startsWith('@')) {
        const imagePrompt = query.slice(1).trim();
        const imageUrl = await generateImage(imagePrompt);
        setGeneratedImage({ url: imageUrl, prompt: imagePrompt });
        setSearchResults(null);
      } else {
        const [sourcesData, answerData, topicsData] = await Promise.all([
          searchGoogle(query),
          getAnswer(query),
          getSimilarTopics(query)
        ]);
        setSearchResults({
          question: query,
          sources: sourcesData,
          answer: answerData,
          similarTopics: topicsData
        });
        setGeneratedImage(null);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File, currentFileState: File | null) => {
    setLoading(true);
    setCurrentFile(file);
    
    try {
      if (file.type.startsWith('image/')) {
        const formData = new FormData();
        formData.append('image', file);
        const objects = await detectObjects(file);
        setFileAnalysis({
          type: 'image',
          content: await analyzeImage(URL.createObjectURL(file), 'Describe this image in detail'),
          metadata: objects
        });
      } else {
        const text = await file.text();
        setFileAnalysis({
          type: 'code',
          content: await explainCode(text)
        });
      }
    } catch (error) {
      toast.error('Failed to analyze file');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSearchResults(null);
    setFileAnalysis(null);
    setGeneratedImage(null);
    setPromptValue('');
    setCurrentFile(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0B0F]">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-900" />
      <div className="relative">
        <Header showBackButton={!!searchResults || !!fileAnalysis || !!generatedImage} onBack={reset} />
        <main className="flex-1 container mx-auto px-4 py-6">
          {!searchResults && !fileAnalysis && !generatedImage ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
              <div className="flex flex-col items-center gap-2">
                <a
                  href="https://www.together.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-sm hover:bg-white/20 transition-all text-white/90"
                >
                  Powered by Together AI
                </a>
                <h1 className="text-6xl font-bold text-center mt-4 text-white">
                  Turn Questions into Discoveries
                </h1>
                <p className="text-white/80 text-center mt-2">
                  Start with @ to generate images, or just type to search
                </p>
              </div>

              <div className="w-full max-w-2xl">
                <SearchInput
                  value={promptValue}
                  onChange={setPromptValue}
                  onSearch={handleSearch}
                  onFileUpload={(file) => handleFileUpload(file, currentFile)}
                  disabled={loading}
                />
                
                <div className="mt-6 flex flex-col gap-2">
                  <div className="flex justify-center gap-2">
                    {EXAMPLE_QUESTIONS.slice(0, 2).map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(question)}
                        className="px-4 py-2 text-sm bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all flex-1 max-w-xs text-white/90"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={() => handleSearch(EXAMPLE_QUESTIONS[2])}
                      className="px-4 py-2 text-sm bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all max-w-xs w-2/3 text-white/90"
                    >
                      {EXAMPLE_QUESTIONS[2]}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-5xl mx-auto space-y-4">
              {searchResults && (
                <>
                  <QuestionDisplay question={searchResults.question} />
                  <Sources sources={searchResults.sources} isLoading={loading} />
                  <Answer content={searchResults.answer} />
                  <SimilarTopics 
                    topics={searchResults.similarTopics} 
                    onTopicClick={handleSearch}
                    onReset={reset}
                  />
                </>
              )}
              {fileAnalysis && currentFile && (
                <FileAnalysis file={currentFile} analysis={fileAnalysis} />
              )}
              {generatedImage && (
                <GeneratedImage 
                  imageUrl={generatedImage.url} 
                  prompt={generatedImage.prompt} 
                />
              )}
              <div className="mt-6">
                <SearchInput
                  value={promptValue}
                  onChange={setPromptValue}
                  onSearch={handleSearch}
                  onFileUpload={(file) => handleFileUpload(file, currentFile)}
                  disabled={loading}
                />
              </div>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;