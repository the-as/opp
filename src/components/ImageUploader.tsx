import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Image as ImageIcon, Camera, FileImage, Sparkles } from 'lucide-react';
import { ImageFile } from '../types';

interface ImageUploaderProps {
  onImageSelect: (imageFile: ImageFile) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    setIsProcessing(true);

    const img = new Image();
    img.onload = () => {
      const imageFile: ImageFile = {
        file,
        url: URL.createObjectURL(file),
        originalWidth: img.naturalWidth,
        originalHeight: img.naturalHeight
      };
      onImageSelect(imageFile);
      setIsProcessing(false);
    };
    img.src = URL.createObjectURL(file);
  }, [onImageSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative"
    >
      <motion.div
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
          isDragOver
            ? 'border-blue-400 bg-blue-50/50 scale-105'
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50/50'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragOver(false);
        }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <AnimatePresence mode="wait">
          {isProcessing ? (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center space-y-4"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="p-4 bg-blue-100 rounded-full"
              >
                <Sparkles className="w-8 h-8 text-blue-600" />
              </motion.div>
              <p className="text-lg font-medium text-gray-700">Processing your image...</p>
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center space-y-6"
            >
              <motion.div
                className="relative"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="p-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg">
                  <Upload className="w-12 h-12 text-white" />
                </div>
                <motion.div
                  className="absolute -top-1 -right-1 p-2 bg-yellow-400 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-4 h-4 text-yellow-800" />
                </motion.div>
              </motion.div>

              <div className="space-y-4">
                <motion.h3
                  className="text-2xl font-bold text-gray-800"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Drop your masterpiece here
                </motion.h3>
                <motion.p
                  className="text-gray-600 max-w-md"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Transform your images with professional-grade editing tools. 
                  Supports JPEG, PNG, WebP, and more.
                </motion.p>
              </div>

              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="group relative overflow-hidden inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  <ImageIcon className="w-5 h-5 mr-3" />
                  <span className="font-semibold">Choose Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                </label>

                <motion.button
                  className="inline-flex items-center px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-blue-400 hover:text-blue-600 transition-all duration-300 font-semibold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Camera className="w-5 h-5 mr-3" />
                  Take Photo
                </motion.button>
              </motion.div>

              <motion.div
                className="flex items-center justify-center space-x-8 text-sm text-gray-500 pt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center space-x-2">
                  <FileImage className="w-4 h-4" />
                  <span>Max 50MB</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Enhanced</span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          <motion.div
            className="absolute -top-4 -left-4 w-24 h-24 bg-blue-200/30 rounded-full"
            animate={{ 
              x: [0, 10, 0],
              y: [0, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-4 -right-4 w-32 h-32 bg-purple-200/30 rounded-full"
            animate={{ 
              x: [0, -15, 0],
              y: [0, 10, 0],
              scale: [1, 0.9, 1]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ImageUploader;