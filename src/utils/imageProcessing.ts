import { ImageSettings } from '../types';

export const applyFilters = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  settings: ImageSettings
): void => {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Save context state
  ctx.save();
  
  // Apply transformations
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  
  ctx.translate(centerX, centerY);
  
  // Apply rotation
  if (settings.rotation !== 0) {
    ctx.rotate((settings.rotation * Math.PI) / 180);
  }
  
  // Apply flips
  const scaleX = settings.flipHorizontal ? -1 : 1;
  const scaleY = settings.flipVertical ? -1 : 1;
  ctx.scale(scaleX, scaleY);
  
  // Apply filters using CSS filter property
  const filters = [
    `brightness(${settings.brightness}%)`,
    `contrast(${settings.contrast}%)`,
    `saturate(${settings.saturation}%)`,
    `hue-rotate(${settings.hue}deg)`,
    `grayscale(${settings.grayscale}%)`,
    `sepia(${settings.sepia}%)`,
    `blur(${settings.blur}px)`,
  ];
  
  ctx.filter = filters.join(' ');
  
  // Draw image with filters
  ctx.drawImage(img, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
  
  // Apply advanced effects
  if (settings.vignette > 0) {
    applyVignette(ctx, canvas.width, canvas.height, settings.vignette);
  }
  
  // Restore context state
  ctx.restore();
};

const applyVignette = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number
): void => {
  const gradient = ctx.createRadialGradient(
    width / 2, height / 2, 0,
    width / 2, height / 2, Math.max(width, height) / 2
  );
  
  gradient.addColorStop(0, `rgba(0, 0, 0, 0)`);
  gradient.addColorStop(1, `rgba(0, 0, 0, ${intensity / 100})`);
  
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillStyle = gradient;
  ctx.fillRect(-width / 2, -height / 2, width, height);
  ctx.globalCompositeOperation = 'source-over';
};

export const calculateAspectRatio = (
  originalWidth: number,
  originalHeight: number,
  newWidth: number,
  newHeight: number,
  maintainRatio: boolean
): { width: number; height: number } => {
  if (!maintainRatio) {
    return { width: newWidth, height: newHeight };
  }
  
  const aspectRatio = originalWidth / originalHeight;
  
  if (newWidth / newHeight > aspectRatio) {
    return { width: newHeight * aspectRatio, height: newHeight };
  } else {
    return { width: newWidth, height: newWidth / aspectRatio };
  }
};

export const downloadImage = (
  canvas: HTMLCanvasElement,
  filename: string,
  format: string,
  quality: number,
  progressive: boolean = false
): void => {
  const mimeType = `image/${format}`;
  const qualityValue = format === 'png' ? undefined : quality / 100;
  
  canvas.toBlob((blob) => {
    if (!blob) return;
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, mimeType, qualityValue);
};

export const generateHistogram = (
  canvas: HTMLCanvasElement
): { red: number[]; green: number[]; blue: number[]; luminance: number[] } => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return { red: [], green: [], blue: [], luminance: [] };
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  const red = new Array(256).fill(0);
  const green = new Array(256).fill(0);
  const blue = new Array(256).fill(0);
  const luminance = new Array(256).fill(0);
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const lum = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
    
    red[r]++;
    green[g]++;
    blue[b]++;
    luminance[lum]++;
  }
  
  return { red, green, blue, luminance };
};

export const getFilterPresets = () => [
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Classic film look',
    settings: {
      brightness: 110,
      contrast: 120,
      saturation: 80,
      sepia: 30,
      vignette: 20,
      temperature: 10
    }
  },
  {
    id: 'dramatic',
    name: 'Dramatic',
    description: 'High contrast and vibrant',
    settings: {
      brightness: 105,
      contrast: 140,
      saturation: 130,
      clarity: 20,
      shadows: -20,
      highlights: -10
    }
  },
  {
    id: 'bw-classic',
    name: 'B&W Classic',
    description: 'Timeless black and white',
    settings: {
      grayscale: 100,
      contrast: 125,
      brightness: 105,
      clarity: 15
    }
  },
  {
    id: 'warm-sunset',
    name: 'Warm Sunset',
    description: 'Golden hour warmth',
    settings: {
      temperature: 25,
      tint: 10,
      saturation: 115,
      highlights: -15,
      shadows: 10
    }
  },
  {
    id: 'cool-blue',
    name: 'Cool Blue',
    description: 'Cool, crisp tones',
    settings: {
      temperature: -20,
      tint: -5,
      saturation: 110,
      contrast: 115,
      clarity: 10
    }
  },
  {
    id: 'soft-portrait',
    name: 'Soft Portrait',
    description: 'Gentle skin tones',
    settings: {
      brightness: 108,
      contrast: 95,
      saturation: 90,
      blur: 0.5,
      highlights: 10,
      shadows: 15
    }
  }
];