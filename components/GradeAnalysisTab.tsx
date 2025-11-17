
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './ImageUploader';
import Loader from './Loader';
import { ResultCard } from './ResultCard';
import { analyzePalletImage } from '../services/geminiService';
import { AnalysisResult } from '../types';

interface GradeAnalysisTabProps {
    onTakePhoto: () => (callback: (file: File) => void) => void;
}

const GradeAnalysisTab: React.FC<GradeAnalysisTabProps> = ({ onTakePhoto }) => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const resetState = useCallback(() => {
        setImageFile(null);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(null);
        setAnalysisResult(null);
        setIsLoading(false);
        setError(null);
    }, [previewUrl]);

    const handleImageSelect = useCallback((file: File) => {
        resetState();
        setImageFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    }, [resetState]);
    
    const handleImageCapture = useCallback((file: File) => {
        resetState();
        setImageFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    }, [resetState]);

    const handleAnalyze = async () => {
        if (!imageFile) return;

        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);

        try {
            const result = await analyzePalletImage(imageFile);
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

    return (
        <>
            {!previewUrl && <ImageUploader onImageSelect={handleImageSelect} onTakePhoto={() => onTakePhoto()(handleImageCapture)} disabled={isLoading} />}
            
            {previewUrl && (
                <div className="w-full max-w-lg flex flex-col items-center gap-6">
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden border-2 border-gray-800 shadow-2xl shadow-black/50">
                        <img src={previewUrl} alt="Aperçu de la palette" className="w-full h-full object-cover" />
                    </div>

                    {!isLoading && !analysisResult && !error && (
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleAnalyze}
                                disabled={isLoading}
                                className="px-8 py-3 bg-lime-500 text-black font-bold text-lg rounded-lg shadow-lg shadow-lime-500/20 hover:bg-lime-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 focus:ring-offset-[#121212] transition-all duration-300 disabled:bg-lime-500/50 disabled:shadow-none disabled:cursor-not-allowed"
                            >
                                Analyser la Palette
                            </button>
                             <button
                                onClick={resetState}
                                className="px-4 py-3 bg-gray-800 text-gray-300 font-semibold rounded-lg border border-gray-700 hover:bg-gray-700 hover:border-gray-600 transition-colors"
                            >
                                Changer
                            </button>
                        </div>
                    )}
                </div>
            )}

            {isLoading && <Loader text="Analyse du grade..." />}
            
            {error && (
                <div className="w-full max-w-lg p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-center">
                    <p className="font-bold">Erreur d'analyse</p>
                    <p>{error}</p>
                </div>
            )}
            
            {analysisResult && (
                <div className="w-full max-w-lg flex flex-col items-center gap-4">
                    <ResultCard result={analysisResult} />
                     <button
                        onClick={resetState}
                        className="mt-4 px-8 py-3 bg-gray-800 text-gray-200 font-bold rounded-lg shadow-md border border-gray-700 hover:bg-gray-700 hover:border-gray-600 transition-colors"
                    >
                        Analyser une autre palette
                    </button>
                </div>
            )}
        </>
    );
};

export default GradeAnalysisTab;
