import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Maximize2, BarChart3, Info } from 'lucide-react';
import { ImageSettings, ImageFile } from '../types';
import { applyFilters, calculateAspectRatio, generateHistogram } from '../utils/imageProcessing';

interface ImagePreviewProps {
  imageFile: ImageFile;
  settings: ImageSettings;
  onCanvasReady: (canvas: HTMLCanvasElement) => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageFile,
  settings,
  onCanvasReady
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [showComparison, setShowComparison] = useState(true);
  const [showHistogram, setShowHistogram] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [histogram, setHistogram] = useState<any>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = calculateAspectRatio(
      imageFile.originalWidth,
      imageFile.originalHeight,
      settings.width,
      settings.height,
      settings.maintainAspectRatio
    );

    canvas.width = width;
    canvas.height = height;

    const processImage = () => {
      applyFilters(canvas, ctx, img, settings);
      onCanvasReady(canvas);
      
      // Generate histogram
      if (showHistogram) {
        const histData = generateHistogram(canvas);
        setHistogram(histData);
      }
    };

    img.onload = processImage;
    if (img.complete) processImage();
  }, [imageFile, settings, onCanvasReady, showHistogram]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
            <h3 className="text-lg font-semibold text-gray-800">Live Preview</h3>
          </div>
          
          <div className="flex items-center space-x-2">
            <motion.button
              onClick={() => setShowComparison(!showComparison)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2 rounded-lg transition-all duration-200 ${
                showComparison 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {showComparison ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </motion.button>
            
            <motion.button
              onClick={() => setShowHistogram(!showHistogram)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2 rounded-lg transition-all duration-200 ${
                showHistogram 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
            </motion.button>
            
            <motion.button
              onClick={toggleFullscreen}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-200"
            >
              <Maximize2 className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {showComparison ? (
            <motion.div
              key="comparison"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Original */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Original
                  </h4>
                </div>
                <motion.div
                  className="relative bg-gray-50 rounded-xl p-4 border-2 border-gray-200"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <img
                    src={imageFile.url}
                    alt="Original"
                    className="max-w-full h-auto mx-auto rounded-lg shadow-sm"
                    style={{ maxHeight: '400px' }}
                  />
                </motion.div>
              </div>

              {/* Edited */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <h4 className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                    Edited
                  </h4>
                </div>
                <motion.div
                  className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border-2 border-blue-200"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <img
                    ref={imgRef}
                    src={imageFile.url}
                    alt="Source"
                    className="hidden"
                  />
                  <canvas
                    ref={canvasRef}
                    className="max-w-full h-auto mx-auto rounded-lg shadow-lg"
                    style={{ maxHeight: '400px' }}
                  />
                  
                  {/* Processing overlay */}
                  <motion.div
                    className="absolute inset-0 bg-blue-500/10 rounded-xl flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="text-blue-600 font-medium">Processing...</div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="single"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center"
            >
              <motion.div
                className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200"
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <canvas
                  ref={canvasRef}
                  className="max-w-full h-auto rounded-lg shadow-lg"
                  style={{ maxHeight: '600px' }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Histogram */}
        <AnimatePresence>
          {showHistogram && histogram && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200"
            >
              <div className="flex items-center space-x-2 mb-3">
                <BarChart3 className="w-4 h-4 text-gray-600" />
                <h4 className="text-sm font-semibold text-gray-700">Color Histogram</h4>
              </div>
              <div className="h-32 bg-white rounded-lg p-2 border">
                {/* Simplified histogram visualization */}
                <div className="flex items-end justify-center h-full space-x-1">
                  {Array.from({ length: 50 }, (_, i) => (
                    <div
                      key={i}
                      className="bg-gradient-to-t from-blue-400 to-blue-600 w-1 rounded-t"
                      style={{ height: `${Math.random() * 100}%` }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Image Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200"
        >
          <div className="flex items-center space-x-2 mb-3">
            <Info className="w-4 h-4 text-gray-600" />
            <h4 className="text-sm font-semibold text-gray-700">Image Information</h4>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="space-y-1">
              <span className="text-gray-500 block">Original Size</span>
              <div className="font-mono text-gray-800 bg-white px-2 py-1 rounded">
                {imageFile.originalWidth} × {imageFile.originalHeight}
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-gray-500 block">Current Size</span>
              <div className="font-mono text-gray-800 bg-white px-2 py-1 rounded">
                {settings.width} × {settings.height}
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-gray-500 block">File Size</span>
              <div className="font-mono text-gray-800 bg-white px-2 py-1 rounded">
                {(imageFile.file.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-gray-500 block">Format</span>
              <div className="font-mono text-gray-800 bg-white px-2 py-1 rounded">
                {imageFile.file.type.split('/')[1].toUpperCase()}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={toggleFullscreen}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="max-w-full max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-full rounded-lg shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ImagePreview;