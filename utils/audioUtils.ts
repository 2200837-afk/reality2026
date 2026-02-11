// Singleton AudioContext to prevent "Max AudioContexts reached" error
let audioContext: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioContext) {
    // Support webkit prefix for older Safari if needed, though standard AudioContext is widely supported now
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
};

export const decodeAudioData = async (
  base64String: string,
  sampleRate: number = 24000
): Promise<AudioBuffer> => {
  const binaryString = atob(base64String);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const ctx = getAudioContext();
  
  // The API returns raw PCM 16-bit little-endian
  const dataInt16 = new Int16Array(bytes.buffer);
  
  // Create an empty buffer at the target sample rate
  // Note: We create the buffer with the API's sample rate (24000)
  // The browser's AudioContext (likely 44100 or 48000) will handle resampling during playback
  const audioBuffer = ctx.createBuffer(1, dataInt16.length, sampleRate);
  const channelData = audioBuffer.getChannelData(0);

  // Normalize Int16 to Float32 (-1.0 to 1.0)
  for (let i = 0; i < dataInt16.length; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }

  return audioBuffer;
};

export const playAudioBuffer = (buffer: AudioBuffer) => {
  const ctx = getAudioContext();
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.connect(ctx.destination);
  source.start(0);
};