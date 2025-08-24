import React from 'react';
import { motion } from 'framer-motion';
import * as Slider from '@radix-ui/react-slider';
import * as Switch from '@radix-ui/react-switch';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Sun, Contrast, Palette, Droplets, RotateCw, FlipHorizontal, FlipVertical, Zap, Eye, Thermometer, Lightbulb, Share as Shadow, Sparkles } from 'lucide-react';
import { ImageSettings } from '../types';

interface AdvancedControlsProps {
  settings: ImageSettings;
  onSettingsChange: (settings: Partial<ImageSettings>) => void;
}

interface ControlGroup {
  title: string;
  icon: React.ComponentType<any>;
  color: string;
  controls: {
    key: keyof ImageSettings;
    label: string;
    min: number;
    max: number;
    step: number;
    unit?: string;
    icon?: React.ComponentType<any>;
  }[];
}

const controlGroups: ControlGroup[] = [
  {
    title: 'Basic Adjustments',
    icon: Sun,
    color: 'blue',
    controls: [
      { key: 'brightness', label: 'Brightness', min: 0, max: 200, step: 1, unit: '%', icon: Sun },
      { key: 'contrast', label: 'Contrast', min: 0, max: 200, step: 1, unit: '%', icon: Contrast },
      { key: 'saturation', label: 'Saturation', min: 0, max: 200, step: 1, unit: '%', icon: Palette },
      { key: 'vibrance', label: 'Vibrance', min: 0, max: 200, step: 1, unit: '%', icon: Sparkles }
    ]
  },
  {
    title: 'Color Grading',
    icon: Palette,
    color: 'purple',
    controls: [
      { key: 'hue', label: 'Hue', min: -180, max: 180, step: 1, unit: '°', icon: Palette },
      { key: 'temperature', label: 'Temperature', min: -50, max: 50, step: 1, icon: Thermometer },
      { key: 'tint', label: 'Tint', min: -50, max: 50, step: 1, icon: Droplets },
      { key: 'exposure', label: 'Exposure', min: -100, max: 100, step: 1, icon: Lightbulb }
    ]
  },
  {
    title: 'Tone Mapping',
    icon: Eye,
    color: 'green',
    controls: [
      { key: 'highlights', label: 'Highlights', min: -100, max: 100, step: 1, icon: Sun },
      { key: 'shadows', label: 'Shadows', min: -100, max: 100, step: 1, icon: Shadow },
      { key: 'clarity', label: 'Clarity', min: -100, max: 100, step: 1, icon: Zap }
    ]
  },
  {
    title: 'Effects',
    icon: Sparkles,
    color: 'orange',
    controls: [
      { key: 'grayscale', label: 'Grayscale', min: 0, max: 100, step: 1, unit: '%' },
      { key: 'sepia', label: 'Sepia', min: 0, max: 100, step: 1, unit: '%' },
      { key: 'blur', label: 'Blur', min: 0, max: 10, step: 0.1, unit: 'px' },
      { key: 'vignette', label: 'Vignette', min: 0, max: 100, step: 1, unit: '%' }
    ]
  }
];

const AdvancedControls: React.FC<AdvancedControlsProps> = ({
  settings,
  onSettingsChange
}) => {
  const getColorClasses = (color: string) => ({
    bg: `bg-${color}-500`,
    hover: `hover:bg-${color}-600`,
    text: `text-${color}-600`,
    border: `border-${color}-200`,
    gradient: `from-${color}-500 to-${color}-600`
  });

  return (
    <Tooltip.Provider>
      <div className="space-y-8">
        {controlGroups.map((group, groupIndex) => {
          const IconComponent = group.icon;
          const colors = getColorClasses(group.color);
          
          return (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: groupIndex * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className={`p-2 bg-gradient-to-br ${colors.gradient} rounded-lg`}>
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">{group.title}</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {group.controls.map((control, controlIndex) => {
                  const ControlIcon = control.icon;
                  const value = settings[control.key] as number;
                  
                  return (
                    <motion.div
                      key={control.key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (groupIndex * 0.1) + (controlIndex * 0.05) }}
                      className="space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <Tooltip.Root>
                          <Tooltip.Trigger asChild>
                            <div className="flex items-center space-x-2 cursor-help">
                              {ControlIcon && <ControlIcon className="w-4 h-4 text-gray-500" />}
                              <label className="text-sm font-medium text-gray-700">
                                {control.label}
                              </label>
                            </div>
                          </Tooltip.Trigger>
                          <Tooltip.Portal>
                            <Tooltip.Content
                              className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm shadow-lg"
                              sideOffset={5}
                            >
                              Adjust {control.label.toLowerCase()}
                              <Tooltip.Arrow className="fill-gray-900" />
                            </Tooltip.Content>
                          </Tooltip.Portal>
                        </Tooltip.Root>
                        
                        <span className="text-sm font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {value}{control.unit || ''}
                        </span>
                      </div>
                      
                      <Slider.Root
                        className="relative flex items-center select-none touch-none w-full h-5"
                        value={[value]}
                        onValueChange={([newValue]) => 
                          onSettingsChange({ [control.key]: newValue })
                        }
                        max={control.max}
                        min={control.min}
                        step={control.step}
                      >
                        <Slider.Track className="bg-gray-200 relative grow rounded-full h-2">
                          <Slider.Range className={`absolute bg-gradient-to-r ${colors.gradient} h-full rounded-full`} />
                        </Slider.Track>
                        <Slider.Thumb
                          className={`block w-5 h-5 bg-white shadow-lg border-2 ${colors.border} rounded-full hover:scale-110 focus:outline-none focus:ring-2 focus:ring-${group.color}-400 transition-all duration-200`}
                          aria-label={control.label}
                        />
                      </Slider.Root>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
        
        {/* Transform Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
              <RotateCw className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Transform</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Rotation */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <RotateCw className="w-4 h-4 text-gray-500" />
                  <label className="text-sm font-medium text-gray-700">Rotation</label>
                </div>
                <span className="text-sm font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                  {settings.rotation}°
                </span>
              </div>
              <Slider.Root
                className="relative flex items-center select-none touch-none w-full h-5"
                value={[settings.rotation]}
                onValueChange={([value]) => onSettingsChange({ rotation: value })}
                max={360}
                min={-360}
                step={1}
              >
                <Slider.Track className="bg-gray-200 relative grow rounded-full h-2">
                  <Slider.Range className="absolute bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full" />
                </Slider.Track>
                <Slider.Thumb className="block w-5 h-5 bg-white shadow-lg border-2 border-indigo-200 rounded-full hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-200" />
              </Slider.Root>
            </div>
            
            {/* Flip Controls */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-gray-700">Flip</label>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch.Root
                    className="w-11 h-6 bg-gray-200 rounded-full relative data-[state=checked]:bg-indigo-500 transition-colors duration-200"
                    checked={settings.flipHorizontal}
                    onCheckedChange={(checked) => onSettingsChange({ flipHorizontal: checked })}
                  >
                    <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow-lg transition-transform duration-200 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[22px]" />
                  </Switch.Root>
                  <FlipHorizontal className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Horizontal</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch.Root
                    className="w-11 h-6 bg-gray-200 rounded-full relative data-[state=checked]:bg-indigo-500 transition-colors duration-200"
                    checked={settings.flipVertical}
                    onCheckedChange={(checked) => onSettingsChange({ flipVertical: checked })}
                  >
                    <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow-lg transition-transform duration-200 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[22px]" />
                  </Switch.Root>
                  <FlipVertical className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Vertical</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Tooltip.Provider>
  );
};

export default AdvancedControls;