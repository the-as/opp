import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Sparkles, Sun, Moon, Camera, Heart } from 'lucide-react';
import { FilterPreset, ImageSettings } from '../types';
import { getFilterPresets } from '../utils/imageProcessing';

interface FilterPresetsProps {
  onPresetApply: (settings: Partial<ImageSettings>) => void;
}

const presetIcons = {
  vintage: Camera,
  dramatic: Sparkles,
  'bw-classic': Moon,
  'warm-sunset': Sun,
  'cool-blue': Moon,
  'soft-portrait': Heart
};

const FilterPresets: React.FC<FilterPresetsProps> = ({ onPresetApply }) => {
  const presets = getFilterPresets();

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Palette className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-800">Filter Presets</h3>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {presets.map((preset, index) => {
          const IconComponent = presetIcons[preset.id as keyof typeof presetIcons] || Sparkles;
          
          return (
            <motion.button
              key={preset.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onPresetApply(preset.settings)}
              className="group relative p-4 bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex flex-col items-center space-y-3">
                <div className="p-3 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full group-hover:from-purple-200 group-hover:to-blue-200 transition-all duration-300">
                  <IconComponent className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-center">
                  <h4 className="font-semibold text-gray-800 text-sm">{preset.name}</h4>
                  <p className="text-xs text-gray-500 mt-1">{preset.description}</p>
                </div>
              </div>
              
              {/* Hover effect overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={false}
              />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default FilterPresets;