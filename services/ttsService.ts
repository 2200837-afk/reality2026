
import { GoogleGenAI, Modality } from "@google/genai";
import { VoicePersona } from "../types";
import { decodeAudioData, playAudioBuffer } from "../utils/audioUtils";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const PERSONA_CONFIGS = {
  HEADMASTER: {
    voice: 'Fenrir',
    promptPrefix: "You are a strict, authoritative Physics Headmaster with a deep voice. Read the following explanation in a lecturing, serious, but educational tone: "
  },
  SISTER: {
    voice: 'Kore',
    promptPrefix: "You are a gentle, intellectual, and slightly flirtatious senior female student. Read the following explanation in a soft, caring, and engaging voice: "
  },
  REBEL: {
    voice: 'Puck',
    promptPrefix: "You are a dismissive, arrogant rich playboy who thinks he knows everything. Read the following explanation in a mocking, bored tone, starting with 'You don't even know this?': "
  }
};

export const speakExplanation = async (text: string, persona: VoicePersona) => {
  try {
    const config = PERSONA_CONFIGS[persona];
    
    // Updated to use Modality.AUDIO and correct responseModalities array as per guidelines
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `${config.promptPrefix} "${text}"` }] }],
      config: {
        responseModalities: [Modality.AUDIO], 
        speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: config.voice },
            },
        },
      },
    });

    // Access base64 audio data from candidates
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (base64Audio) {
      const audioBuffer = await decodeAudioData(base64Audio, 24000);
      playAudioBuffer(audioBuffer);
    } else {
      console.warn("TTS: No audio data received in response");
    }
  } catch (error) {
    console.error("TTS Service Error:", error);
    // Silent fail in UI is better than crashing, but we log to console
  }
};
