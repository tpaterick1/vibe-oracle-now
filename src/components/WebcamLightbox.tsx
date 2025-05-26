
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, XCircle, RefreshCw, CheckCircle } from 'lucide-react';

interface WebcamLightboxProps {
  onClose: () => void; // Function to call when closing the lightbox (e.g., to close a dialog)
  onImageCapture?: (imageDataUrl: string) => void; // Optional: callback with captured image data
}

const WebcamLightbox: React.FC<WebcamLightboxProps> = ({ onClose, onImageCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const startCamera = useCallback(async () => {
    setError(null);
    setCapturedImage(null);
    setIsCameraReady(false);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          // Wait for video metadata to load to get correct dimensions
          videoRef.current.onloadedmetadata = () => {
            setIsCameraReady(true);
          };
        }
      } else {
        setError("getUserMedia not supported on this browser.");
      }
    } catch (err) {
      console.error("Error accessing webcam:", err);
      if (err instanceof Error) {
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          setError("Webcam access was denied. Please allow camera access in your browser settings.");
        } else {
          setError(`Error accessing webcam: ${err.message}`);
        }
      } else {
        setError("An unknown error occurred while accessing the webcam.");
      }
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCameraReady(false);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [stream]);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current && isCameraReady) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL('image/png');
        setCapturedImage(imageDataUrl);
        stopCamera(); // Stop camera after capture
      }
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startCamera();
  };

  const handleUsePhoto = () => {
    if (capturedImage && onImageCapture) {
      onImageCapture(capturedImage);
    }
    onClose(); // Close lightbox after using photo
  };

  return (
    <div className="p-4 bg-brand-charcoal rounded-lg text-foreground relative">
      {error && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10 p-4 rounded-lg">
          <XCircle className="w-16 h-16 text-neon-pink mb-4" />
          <p className="text-center text-lg text-neon-pink">{error}</p>
          <Button onClick={onClose} variant="outline" className="mt-4 border-neon-teal text-neon-teal hover:bg-neon-teal/20">
            Close
          </Button>
        </div>
      )}

      {!error && (
        <>
          <div className="relative aspect-video w-full max-w-md mx-auto mb-4 rounded-md overflow-hidden border-2 border-neon-teal">
            {capturedImage ? (
              <img src={capturedImage} alt="Captured" className="w-full h-full object-contain" />
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover transition-opacity duration-300 ${isCameraReady ? 'opacity-100' : 'opacity-0'}`}
              />
            )}
            {!capturedImage && !isCameraReady && !error && (
              <div className="absolute inset-0 flex items-center justify-center bg-brand-deep-black">
                <p className="text-neon-teal animate-pulse">Starting camera...</p>
              </div>
            )}
            <canvas ref={canvasRef} className="hidden"></canvas>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            {capturedImage ? (
              <>
                <Button onClick={handleRetake} variant="outline" className="border-neon-pink text-neon-pink hover:bg-neon-pink/20 w-full sm:w-auto">
                  <RefreshCw className="mr-2" /> Retake
                </Button>
                <Button onClick={handleUsePhoto} className="bg-neon-teal text-brand-deep-black hover:bg-neon-teal/80 w-full sm:w-auto">
                  <CheckCircle className="mr-2" /> Use Photo
                </Button>
              </>
            ) : (
              <Button onClick={handleCapture} disabled={!isCameraReady || !!error} className="bg-neon-pink text-white hover:bg-neon-pink/80 disabled:bg-gray-500 w-full sm:w-auto">
                <Camera className="mr-2" /> Capture Photo
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default WebcamLightbox;
