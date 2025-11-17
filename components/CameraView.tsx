import React, { useState, useRef, useEffect, useCallback } from 'react';
import Loader from './Loader';

interface CameraViewProps {
  onCapture: (file: File) => void;
  onClose: () => void;
}

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
);

const CameraView: React.FC<CameraViewProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCameraLoading, setIsCameraLoading] = useState(true);

  useEffect(() => {
    const getCameraStream = async () => {
      setIsCameraLoading(true);
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Erreur d'accès à la caméra:", err);
        setError("Impossible d'accéder à la caméra. Veuillez vérifier les autorisations de votre navigateur.");
      } finally {
        setIsCameraLoading(false);
      }
    };
    getCameraStream();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const handleCapture = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);
      }
    }
  }, []);

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const handleConfirm = useCallback(() => {
    if (canvasRef.current) {
      canvasRef.current.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
          onCapture(file);
        }
      }, 'image/jpeg', 0.95);
    }
  }, [onCapture]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="relative w-full max-w-4xl aspect-[4/3] bg-black rounded-xl overflow-hidden shadow-2xl flex items-center justify-center">
        <button onClick={onClose} className="absolute top-4 right-4 z-20 p-2 bg-black/50 rounded-full text-white hover:bg-black/80 transition-colors" aria-label="Fermer la caméra">
          <CloseIcon className="w-6 h-6" />
        </button>

        {error && <div className="text-white text-center p-4"><p className="font-bold">Erreur</p><p>{error}</p></div>}
        
        {isCameraLoading && !error && (
            <div className="text-white">
                <Loader />
            </div>
        )}

        {!error && !isCameraLoading && (
            <>
                <video ref={videoRef} autoPlay playsInline muted className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${capturedImage ? 'opacity-0' : 'opacity-100'}`} />
                <canvas ref={canvasRef} className="hidden" />
                {capturedImage && <img src={capturedImage} alt="Aperçu de la capture" className="absolute inset-0 w-full h-full object-cover" />}

                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent flex justify-center">
                    {!capturedImage ? (
                        <button onClick={handleCapture} className="p-4 bg-white rounded-full shadow-lg group" aria-label="Prendre la photo">
                           <div className="w-10 h-10 rounded-full bg-white ring-4 ring-offset-2 ring-offset-black ring-white group-hover:scale-110 transition-transform"></div>
                        </button>
                    ) : (
                        <div className="flex items-center gap-8">
                            <button onClick={handleRetake} className="px-6 py-3 bg-gray-700 text-white font-bold rounded-lg shadow-md hover:bg-gray-600 transition-colors">
                                Reprendre
                            </button>
                            <button onClick={handleConfirm} className="px-8 py-3 bg-lime-500 text-black font-bold rounded-lg shadow-lg hover:bg-lime-600 transition-colors">
                                Utiliser cette photo
                            </button>
                        </div>
                    )}
                </div>
            </>
        )}
      </div>
    </div>
  );
};

export default CameraView;
