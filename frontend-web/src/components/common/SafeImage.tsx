import { ImageOff } from 'lucide-react';
import { useState } from 'react';

interface SafeImageProps {
  src?: string | null;
  alt: string;
  className?: string;
}

/** Neutral placeholder shown when an image is missing or fails to load (no third-party stock photo). */
function ImagePlaceholder({ alt, className }: { alt: string; className: string }) {
  return (
    <div role="img" aria-label={alt} className={`bg-[#F8F1E7] flex items-center justify-center overflow-hidden ${className}`}>
      <ImageOff className="w-1/3 h-1/3 min-w-4 min-h-4 max-w-8 max-h-8 text-stone-300" aria-hidden="true" />
    </div>
  );
}

function SafeImageInner({ src, alt, className = '' }: SafeImageProps) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return <ImagePlaceholder alt={alt} className={className} />;
  return <img src={src} alt={alt} className={className} loading="lazy" onError={() => setFailed(true)} />;
}

/**
 * Image with a neutral placeholder when the source is empty or fails to load.
 * The inner component is keyed by `src`, so a new source resets the failed state without an effect.
 */
export function SafeImage(props: SafeImageProps) {
  return <SafeImageInner key={props.src ?? ''} {...props} />;
}
