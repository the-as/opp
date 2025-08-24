import React from 'react';
import { Edit3, Palette, Download } from 'lucide-react';
import ImageEditor from './components/ImageEditor';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Edit3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  ImageCraft Studio
                </h1>
                <p className="text-gray-600">
                  Professional image editing made simple
                </p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Palette className="w-4 h-4" />
                <span>Filters & Effects</span>
              </div>
              <div className="flex items-center space-x-1">
                <Download className="w-4 h-4" />
                <span>Export Options</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ImageEditor />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">
              Powered by advanced canvas-based image processing
            </p>
            <div className="flex justify-center space-x-6 text-sm">
              <span>✨ Real-time preview</span>
              <span>🎨 Professional filters</span>
              <span>📱 Responsive design</span>
              <span>🚀 Fast processing</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;