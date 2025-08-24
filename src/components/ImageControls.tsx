import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Tabs from '@radix-ui/react-tabs';
import * as Switch from '@radix-ui/react-switch';
import * as Select from '@radix-ui/react-select';
import { Download, RotateCcw, Settings, Palette, Maximize as Resize, FileDown, ChevronDown, Check, Sliders, Sparkles, History } from 'lucide-react';
import { ImageSettings, DownloadSettings } from '../types';
import AdvancedControls from './AdvancedControls';
import FilterPresets from './FilterPresets';

interface ImageControlsProps {
  settings: ImageSettings;
  downloadSettings: DownloadSettings;
  onSettingsChange: (settings: Partial<ImageSettings>) => void;
  onDownloadSettingsChange: (settings: Partial<DownloadSettings>) => void;
  onReset: () => void;
  onDownload: () => void;
  originalDimensions: { width: number; height: number };
}

const ImageControls: React.FC<ImageControlsProps> = ({
  settings,
  downloadSettings,
  onSettingsChange,
  onDownloadSettingsChange,
  onReset,
  onDownload,
  originalDimensions
}) => {
  const [activeTab, setActiveTab] = useState('adjustments');

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
    >
      <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Tab Navigation */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <Tabs.List className="flex overflow-x-auto">
            {[
              { value: 'adjustments', label: 'Adjustments', icon: Sliders },
              { value: 'presets', label: 'Presets', icon: Sparkles },
              { value: 'resize', label: 'Resize', icon: Resize },
              { value: 'export', label: 'Export', icon: FileDown }
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <Tabs.Trigger
                  key={tab.value}
                  value={tab.value}
                  className="group relative flex items-center space-x-2 px-6 py-4 text-sm font-medium text-gray-600 hover:text-gray-900 data-[state=active]:text-blue-600 transition-all duration-200 whitespace-nowrap"
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{tab.label}</span>
                  
                  {/* Active indicator */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                    initial={false}
                    animate={{
                      scaleX: activeTab === tab.value ? 1 : 0,
                      opacity: activeTab === tab.value ? 1 : 0
                    }}
                    transition={{ duration: 0.2 }}
                  />
                </Tabs.Trigger>
              );
            })}
          </Tabs.List>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* Adjustments Tab */}
            <Tabs.Content value="adjustments" className="focus:outline-none">
              <motion.div
                key="adjustments"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <AdvancedControls
                  settings={settings}
                  onSettingsChange={onSettingsChange}
                />
              </motion.div>
            </Tabs.Content>

            {/* Presets Tab */}
            <Tabs.Content value="presets" className="focus:outline-none">
              <motion.div
                key="presets"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <FilterPresets onPresetApply={onSettingsChange} />
              </motion.div>
            </Tabs.Content>

            {/* Resize Tab */}
            <Tabs.Content value="resize" className="focus:outline-none">
              <motion.div
                key="resize"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center space-x-2">
                  <Resize className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Image Dimensions</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Width (px)
                    </label>
                    <input
                      type="number"
                      value={settings.width}
                      onChange={(e) => onSettingsChange({ width: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Height (px)
                    </label>
                    <input
                      type="number"
                      value={settings.height}
                      onChange={(e) => onSettingsChange({ height: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                  <Switch.Root
                    className="w-11 h-6 bg-gray-200 rounded-full relative data-[state=checked]:bg-blue-500 transition-colors duration-200"
                    checked={settings.maintainAspectRatio}
                    onCheckedChange={(checked) => onSettingsChange({ maintainAspectRatio: checked })}
                  >
                    <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow-lg transition-transform duration-200 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[22px]" />
                  </Switch.Root>
                  <span className="text-sm font-medium text-gray-700">
                    Maintain aspect ratio
                  </span>
                </div>

                <div className="p-4 bg-blue-50 rounded-xl">
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Original: {originalDimensions.width} × {originalDimensions.height}</p>
                    <p>Current: {settings.width} × {settings.height}</p>
                  </div>
                </div>
              </motion.div>
            </Tabs.Content>

            {/* Export Tab */}
            <Tabs.Content value="export" className="focus:outline-none">
              <motion.div
                key="export"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center space-x-2">
                  <FileDown className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Export Settings</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Filename
                    </label>
                    <input
                      type="text"
                      value={downloadSettings.filename}
                      onChange={(e) => onDownloadSettingsChange({ filename: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter filename"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Format
                    </label>
                    <Select.Root
                      value={downloadSettings.format}
                      onValueChange={(value) => onDownloadSettingsChange({ format: value as any })}
                    >
                      <Select.Trigger className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 flex items-center justify-between">
                        <Select.Value />
                        <Select.Icon>
                          <ChevronDown className="w-4 h-4" />
                        </Select.Icon>
                      </Select.Trigger>
                      <Select.Portal>
                        <Select.Content className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                          <Select.Viewport className="p-1">
                            {['jpeg', 'png', 'webp', 'bmp', 'tiff'].map((format) => (
                              <Select.Item
                                key={format}
                                value={format}
                                className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded-lg"
                              >
                                <Select.ItemText>{format.toUpperCase()}</Select.ItemText>
                                <Select.ItemIndicator className="ml-auto">
                                  <Check className="w-4 h-4" />
                                </Select.ItemIndicator>
                              </Select.Item>
                            ))}
                          </Select.Viewport>
                        </Select.Content>
                      </Select.Portal>
                    </Select.Root>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">
                      Quality
                    </label>
                    <span className="text-sm font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      {downloadSettings.quality}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={downloadSettings.quality}
                    onChange={(e) => onDownloadSettingsChange({ quality: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Switch.Root
                      className="w-11 h-6 bg-gray-200 rounded-full relative data-[state=checked]:bg-purple-500 transition-colors duration-200"
                      checked={downloadSettings.progressive}
                      onCheckedChange={(checked) => onDownloadSettingsChange({ progressive: checked })}
                    >
                      <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow-lg transition-transform duration-200 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[22px]" />
                    </Switch.Root>
                    <span className="text-sm font-medium text-gray-700">
                      Progressive JPEG
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Switch.Root
                      className="w-11 h-6 bg-gray-200 rounded-full relative data-[state=checked]:bg-purple-500 transition-colors duration-200"
                      checked={downloadSettings.metadata}
                      onCheckedChange={(checked) => onDownloadSettingsChange({ metadata: checked })}
                    >
                      <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow-lg transition-transform duration-200 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[22px]" />
                    </Switch.Root>
                    <span className="text-sm font-medium text-gray-700">
                      Preserve metadata
                    </span>
                  </div>
                </div>
              </motion.div>
            </Tabs.Content>
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row gap-3">
            <motion.button
              onClick={onReset}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-all duration-200 font-medium"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Reset All
            </motion.button>
            
            <motion.button
              onClick={onDownload}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex-1 font-medium shadow-lg hover:shadow-xl"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Image
            </motion.button>
          </div>
        </div>
      </Tabs.Root>
    </motion.div>
  );
};

export default ImageControls;