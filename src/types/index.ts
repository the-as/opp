export interface ImageSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  grayscale: number;
  sepia: number;
  blur: number;
  sharpness: number;
  vignette: number;
  temperature: number;
  tint: number;
  exposure: number;
  highlights: number;
  shadows: number;
  vibrance: number;
  clarity: number;
  quality: number;
  width: number;
  height: number;
  rotation: number;
  flipHorizontal: boolean;
  flipVertical: boolean;
  maintainAspectRatio: boolean;
  cropX: number;
  cropY: number;
  cropWidth: number;
  cropHeight: number;
}

export interface ImageFile {
  file: File;
  url: string;
  originalWidth: number;
  originalHeight: number;
}

export interface DownloadSettings {
  filename: string;
  format: 'jpeg' | 'png' | 'webp' | 'bmp' | 'tiff';
  quality: number;
  progressive: boolean;
  metadata: boolean;
}

export interface FilterPreset {
  id: string;
  name: string;
  description: string;
  settings: Partial<ImageSettings>;
  thumbnail?: string;
}

export interface HistoryState {
  id: string;
  settings: ImageSettings;
  timestamp: number;
  description: string;
}