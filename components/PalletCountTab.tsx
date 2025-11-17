
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './ImageUploader';
import Loader from './Loader';
import { CountResultCard } from './CountResultCard';
import { countPalletsInImage } from '../services/geminiService';
import { CountAnalysisResult } from '../types';

interface PalletCountTabProps {
    onTakePhoto: () => (callback: (file: File) => void) => void;
}

const PalletCountTab: React.FC<PalletCountTabProps> = ({ onTakePhoto }) => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<CountAnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [expectedCount, setExpectedCount] = useState<string>('');

    const resetState = useCallback(() => {
        setImageFile(null);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(null);
        setAnalysisResult(null);
        setIsLoading(false);
        setError(null);
        // Do not reset expectedCount, user might want to try again with the same number
    }, [previewUrl]);

    const handleImageSelect = useCallback((file: File) => {
        // Reset everything except expectedCount
        setImageFile(file);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(URL.createObjectURL(file));
        setAnalysisResult(null);
        setIsLoading(false);
        setError(null);
    }, [previewUrl]);

    const handleImageCapture = useCallback((file: File) => {
        handleImageSelect(file);
    }, [handleImageSelect]);
    
    const handleAnalyze = async () => {
        if (!imageFile || !expectedCount) return;
        const count = parseInt(expectedCount, 10);
        if (isNaN(count) || count <= 0) {
            setError("Veuillez entrer un nombre valide de palettes.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);

        try {
            const result = await countPalletsInImage(imageFile, count);
            setAnalysisResult(result);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Une erreur inconnue est survenue.");
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    const showUploader = !previewUrl && !analysisResult;
    const showPreview = previewUrl && !isLoading && !analysisResult && !error;
    const showResult = analysisResult && !isLoading;

    return (
        <div className="w-full max-w-lg flex flex-col items-center gap-6">
            {showUploader && (
                <div className="w-full flex flex-col items-center gap-4">
                     <label htmlFor="pallet-count-input" className="w-full text-center">
                        <span className="text-lg font-semibold text-gray-300">Combien de palettes attendez-vous ?</span>
                         <input
                            id="pallet-count-input"
                            type="number"
                            value={expectedCount}
                            onChange={(e) => {
                               setError(null);
                               setExpectedCount(e.target.value);
                            }}
                            placeholder="Ex: 15"
                            className="mt-2 w-full p-4 text-center text-2xl font-bold bg-gray-900 border-2 border-gray-700 rounded-xl focus:border-lime-500 focus:ring-lime-500 outline-none transition-colors"
                        />
                    </label>
                    {expectedCount && <ImageUploader onImageSelect={handleImageSelect} onTakePhoto={() => onTakePhoto()(handleImageCapture)} disabled={isLoading} />}
                </div>
            )}
            
            {showPreview && (
                 <>
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden border-2 border-gray-800 shadow-2xl shadow-black/50">
                        <img src={previewUrl} alt="Aperçu des palettes" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleAnalyze}
                            disabled={isLoading}
                            className="px-8 py-3 bg-lime-500 text-black font-bold text-lg rounded-lg shadow-lg shadow-lime-500/20 hover:bg-lime-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 focus:ring-offset-[#121212] transition-all duration-300 disabled:bg-lime-500/50 disabled:shadow-none disabled:cursor-not-allowed"
                        >
                            Valider le comptage
                        </button>
                         <button
                            onClick={handleImageSelect.bind(null, imageFile!)} // re-select same image to reset
                            className="px-4 py-3 bg-gray-800 text-gray-300 font-semibold rounded-lg border border-gray-700 hover:bg-gray-700 hover:border-gray-600 transition-colors"
                        >
                            Changer
                        </button>
                    </div>
                </>
            )}

            {isLoading && <Loader text="Comptage par l'IA..." />}
            
            {error && (
                <div className="w-full p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-center">
                    <p className="font-bold">Erreur</p>
                    <p>{error}</p>
                </div>
            )}
            
            {showResult && (
                <>
                    <CountResultCard result={analysisResult} />
                     <button
                        onClick={resetState}
                        className="mt-4 px-8 py-3 bg-gray-800 text-gray-200 font-bold rounded-lg shadow-md border border-gray-700 hover:bg-gray-700 hover:border-gray-600 transition-colors"
                    >
                        Effectuer un autre comptage
                    </button>
                </>
            )}
        </div>
    );
};

export default PalletCountTab;
