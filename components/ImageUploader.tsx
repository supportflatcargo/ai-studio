import React, { useState, useCallback, useRef } from 'react';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  onTakePhoto: () => void;
  disabled: boolean;
}

const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
    </svg>
);

const CameraIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.776 48.776 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
    </svg>
);


export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, onTakePhoto, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelect(e.target.files[0]);
    }
  };

  const handleDragEvent = useCallback((e: React.DragEvent<HTMLDivElement>, dragging: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(dragging);
    }
  }, [disabled]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    handleDragEvent(e, false);
    if (!disabled && e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageSelect(e.dataTransfer.files[0]);
    }
  }, [disabled, handleDragEvent, onImageSelect]);
  
  const handleClick = () => {
    inputRef.current?.click();
  };

  const baseClasses = "relative flex flex-col items-center justify-center w-full max-w-lg p-10 mx-auto border-2 border-dashed rounded-xl transition-all duration-300 ease-in-out";
  const inactiveClasses = "border-gray-700 bg-gray-900/50 hover:border-lime-500 hover:bg-gray-900/80 cursor-pointer";
  const activeClasses = "border-lime-500 bg-lime-500/20 scale-105";
  const disabledClasses = "border-gray-800 bg-gray-900/20 cursor-not-allowed opacity-50";

  return (
    <div className="w-full max-w-lg">
      <div
        className={`${baseClasses} ${disabled ? disabledClasses : isDragging ? activeClasses : inactiveClasses}`}
        onDragEnter={(e) => handleDragEvent(e, true)}
        onDragLeave={(e) => handleDragEvent(e, false)}
        onDragOver={(e) => handleDragEvent(e, true)}
        onDrop={handleDrop}
        onClick={handleClick}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Glissez-déposez ou cliquez pour téléverser une image"
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick()}}
      >
          <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={disabled}
          />
          <div className="text-center pointer-events-none">
              <UploadIcon className="mx-auto h-12 w-12 text-gray-500" />
              <p className="mt-2 text-lg font-semibold text-gray-200">
                  Glissez-déposez une image de palette
              </p>
              <p className="text-sm text-gray-500">ou cliquez pour sélectionner un fichier</p>
          </div>
      </div>
      <div className="my-4 flex items-center w-full">
        <div className="flex-grow border-t border-gray-700"></div>
        <span className="flex-shrink mx-4 text-gray-500 text-sm font-semibold">OU</span>
        <div className="flex-grow border-t border-gray-700"></div>
      </div>
       <button
        onClick={onTakePhoto}
        disabled={disabled}
        className="w-full flex items-center justify-center px-6 py-3 bg-gray-800 text-gray-200 font-bold text-lg rounded-xl shadow-md border border-gray-700 hover:bg-gray-700 hover:border-gray-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <CameraIcon className="w-6 h-6 mr-3" />
        Prendre une photo
      </button>
    </div>
  );
};