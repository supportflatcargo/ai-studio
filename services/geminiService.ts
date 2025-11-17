
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { AnalysisResult, PalletGrade, CountAnalysisResult } from '../types';

// Utility to convert any image file to a base64 encoded JPEG
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const img = new Image();
      // The result is a data URL (e.g., "data:image/avif;base64,iVBORw0KGgo...")
      img.src = reader.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Could not get canvas context.'));
        }
        ctx.drawImage(img, 0, 0);
        // Convert the canvas content to a JPEG data URL
        const dataUrl = canvas.toDataURL('image/jpeg');
        // Extract the base64 part of the data URL
        const base64Data = dataUrl.split(',')[1];
        if (base64Data) {
          resolve(base64Data);
        } else {
          reject(new Error('Failed to convert image to base64 JPEG.'));
        }
      };
      img.onerror = error => reject(new Error(`Failed to load image for conversion: ${error}`));
    };
    reader.onerror = error => reject(error);
  });
};


const GRADE_PROMPT = `
Analyse l'image de cette palette en bois. Détermine son grade en te basant sur les critères suivants :
- Grade A : Palette neuve ou quasi-neuve. Bois clair et propre. Blocs et planches intacts, sans fissures.
- Grade B : Palette d'occasion en bon état. Peut présenter une couleur de bois plus foncée ou des traces d'utilisation. Peut avoir subi des réparations professionnelles. Toutes les planches sont présentes et solides.
- Grade C : Palette usagée avec des défauts visibles mais réparables. Peut avoir des planches fissurées, des coins ébréchés ou des clous sortis.
- Grade HS (Hors Service) : Palette très endommagée et non réparable. Blocs cassés, plusieurs planches manquantes ou cassées, signes de pourriture. Dangereuse pour l'utilisation.

Réponds exclusivement avec un objet JSON valide. N'inclus aucun texte, explication, ou démarqueur de code (comme \`\`\`json) avant ou après l'objet JSON. La structure de l'objet doit être exactement : { "grade": "A" | "B" | "C" | "HS", "reason": "Une brève justification technique de ta décision en une phrase." }
`;

export const analyzePalletImage = async (imageFile: File): Promise<AnalysisResult> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable is not set.");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const imageBase64 = await fileToBase64(imageFile);

    const imagePart = {
        inlineData: {
            mimeType: 'image/jpeg', // Always send as JPEG after conversion
            data: imageBase64,
        },
    };

    const textPart = {
        text: GRADE_PROMPT,
    };

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [textPart, imagePart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        grade: { type: Type.STRING },
                        reason: { type: Type.STRING }
                    },
                    required: ["grade", "reason"]
                }
            }
        });
        
        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);

        const grade = (result.grade.toUpperCase() as PalletGrade) || PalletGrade.UNKNOWN;

        if (!Object.values(PalletGrade).includes(grade)) {
            return { grade: PalletGrade.UNKNOWN, reason: "Le grade retourné par l'IA est invalide." };
        }

        return {
            grade: grade,
            reason: result.reason || "Aucune raison fournie."
        };

    } catch (error) {
        console.error("Error analyzing image with Gemini:", error);
        throw new Error("L'analyse de l'image a échoué. Veuillez vérifier la console pour plus de détails.");
    }
};

const getCountPrompt = (expectedCount: number) => `
Analyse l'image fournie et compte le nombre total de palettes en bois visibles. L'utilisateur s'attend à trouver ${expectedCount} palettes.
Ta tâche est de vérifier si ton compte correspond à celui de l'utilisateur.

Réponds exclusivement avec un objet JSON valide. N'inclus aucun texte, explication, ou démarqueur de code (comme \`\`\`json) avant ou après l'objet JSON. La structure de l'objet doit être exactement :
{
  "match": true | false,
  "counted": ${"number"},
  "expected": ${expectedCount},
  "reason": "Une brève justification de ton compte en une phrase. Par exemple, 'J'ai compté X palettes empilées.' ou 'Le compte ne correspond pas, j'ai compté X palettes alors que Y étaient attendues.'"
}
`;

export const countPalletsInImage = async (imageFile: File, expectedCount: number): Promise<CountAnalysisResult> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable is not set.");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const imageBase64 = await fileToBase64(imageFile);

    const imagePart = {
        inlineData: {
            mimeType: 'image/jpeg',
            data: imageBase64,
        },
    };

    const textPart = {
        text: getCountPrompt(expectedCount),
    };

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [textPart, imagePart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        match: { type: Type.BOOLEAN },
                        counted: { type: Type.INTEGER },
                        expected: { type: Type.INTEGER },
                        reason: { type: Type.STRING }
                    },
                    required: ["match", "counted", "expected", "reason"]
                }
            }
        });

        const jsonString = response.text.trim();
        return JSON.parse(jsonString) as CountAnalysisResult;

    } catch (error) {
        console.error("Error counting pallets with Gemini:", error);
        throw new Error("Le comptage des palettes a échoué. Veuillez vérifier la console pour plus de détails.");
    }
};
