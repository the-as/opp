import React, { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { ImageFile, ImageSettings, DownloadSettings, HistoryState } from '../types';
import { calculateAspectRatio, downloadImage } from '../utils/imageProcessing';
import ImageUploader from './ImageUploader';
import ImagePreview from './ImagePreview';
import ImageControls from './ImageControls';

const defaultSettings: ImageSettings = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  hue: 0,
  grayscale: 0,
  sepia: 0,
  blur: 0,
  sharpness: 100,
  vignette: 0,
  temperature: 0,
  tint: 0,
  exposure: 0,
  highlights: 0,
  shadows: 0,
  vibrance: 100,
  clarity: 0,
  quality: 90,
  width: 800,
  height: 600,
  rotation: 0,
  flipHorizontal: false,
  flipVertical: false,
  maintainAspectRatio: true,
  cropX: 0,
  cropY: 0,
  cropWidth: 100,
  cropHeight: 100
};

const defaultDownloadSettings: DownloadSettings = {
  filename: 'edited-image',
  format: 'jpeg',
  quality: 90,
  progressive: false,
  metadata: true
};

const ImageEditor: React.FC = () => {
  const [imageFile, setImageFile] = useState<ImageFile | null>(null);
  const [settings, setSettings] = useState<ImageSettings>(defaultSettings);
  const [downloadSettings, setDownloadSettings] = useState<DownloadSettings>(defaultDownloadSettings);
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const addToHistory = useCallback((newSettings: ImageSettings, description: string) => {
    const newState: HistoryState = {
      id: Date.now().toString(),
      settings: { ...newSettings },
      timestamp: Date.now(),
      description
    };
    
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const handleImageSelect = useCallback((selectedImage: ImageFile) => {
    setImageFile(selectedImage);
    
    // Update settings with original dimensions
    const newSettings = {
      ...defaultSettings,
      width: selectedImage.originalWidth,
      height: selectedImage.originalHeight
    };
    setSettings(newSettings);

    // Set default filename based on original file
    const baseName = selectedImage.file.name.split('.')[0];
    setDownloadSettings({
      ...defaultDownloadSettings,
      filename: `${baseName}-edited`
    });

    // Reset history
    setHistory([]);
    setHistoryIndex(-1);
    addToHistory(newSettings, 'Image loaded');
  }, [addToHistory]);

  const handleSettingsChange = useCallback((newSettings: Partial<ImageSettings>) => {
    setSettings(current => {
      const updated = { ...current, ...newSettings };
      
      // Handle aspect ratio maintenance
      if (imageFile && updated.maintainAspectRatio) {
        if ('width' in newSettings && newSettings.width !== current.width) {
          const { height } = calculateAspectRatio(
            imageFile.originalWidth,
            imageFile.originalHeight,
            updated.width,
            updated.height,
            true
          );
          updated.height = Math.round(height);
        } else if ('height' in newSettings && newSettings.height !== current.height) {
          const { width } = calculateAspectRatio(
            imageFile.originalWidth,
            imageFile.originalHeight,
            updated.width,
            updated.height,
            true
          );
          updated.width = Math.round(width);
        }
      }
      
      return updated;
    });
  }, [imageFile]);

  const handleDownloadSettingsChange = useCallback((newSettings: Partial<DownloadSettings>) => {
    setDownloadSettings(current => ({ ...current, ...newSettings }));
  }, []);

  const handleReset = useCallback(() => {
    if (imageFile) {
      const resetSettings = {
        ...defaultSettings,
        width: imageFile.originalWidth,
        height: imageFile.originalHeight
      };
      setSettings(resetSettings);
      addToHistory(resetSettings, 'Reset to defaults');
    }
  }, [imageFile, addToHistory]);

  const handleDownload = useCallback(() => {
    if (canvasRef.current) {
      downloadImage(
        canvasRef.current,
        downloadSettings.filename,
        downloadSettings.format,
        downloadSettings.quality,
        downloadSettings.progressive
      );
    }
  }, [downloadSettings]);

  const handleCanvasReady = useCallback((canvas: HTMLCanvasElement) => {
    canvasRef.current = canvas;
  }, []);

  return (
    <div className="space-y-8">
      {!imageFile ? (
        <ImageUploader onImageSelect={handleImageSelect} />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <ImagePreview
            imageFile={imageFile}
            settings={settings}
            onCanvasReady={handleCanvasReady}
          />
          
          <ImageControls
            settings={settings}
            downloadSettings={downloadSettings}
            onSettingsChange={handleSettingsChange}
            onDownloadSettingsChange={handleDownloadSettingsChange}
            onReset={handleReset}
            onDownload={handleDownload}
            originalDimensions={{
              width: imageFile.originalWidth,
              height: imageFile.originalHeight
            }}
          />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <button
              onClick={() => setImageFile(null)}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 hover:underline"
            >
              ← Choose a different image
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ImageEditor;