import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { Gesture } from "../types";

// FIX: Per coding guidelines, initialize GoogleGenAI with process.env.API_KEY directly.
// The API key's availability is a hard requirement and handled externally.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = 'gemini-2.5-flash';

const prompt = `Analyze the user's hand gesture in the image. Respond in JSON format.
The possible gestures are:
- "OPEN_HAND": An open hand with fingers spread.
- "CLENCHED_FIST": A closed fist.
- "UNKNOWN": Any other gesture or if no hand is clearly visible.

Example response: {"gesture": "OPEN_HAND"}`;

export const detectGesture = async (base64ImageData: string): Promise<Gesture> => {
    try {
        const imagePart = {
            inlineData: {
                data: base64ImageData,
                mimeType: 'image/jpeg',
            },
        };

        const textPart = {
            text: prompt,
        };

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: model,
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        gesture: {
                            type: Type.STRING,
                            enum: [Gesture.OPEN, Gesture.CLOSED, Gesture.UNKNOWN]
                        }
                    },
                    required: ["gesture"],
                }
            }
        });

        // FIX: Trim the response text to avoid JSON parsing errors from leading/trailing whitespace.
        const jsonString = response.text?.trim();
        if (!jsonString) {
            console.warn("Gemini response was empty.");
            return Gesture.UNKNOWN;
        }

        const parsed = JSON.parse(jsonString);
        
        const detectedGesture = parsed.gesture as Gesture;
        if (Object.values(Gesture).includes(detectedGesture)) {
            return detectedGesture;
        }

        return Gesture.UNKNOWN;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to communicate with the Gemini API.");
    }
};