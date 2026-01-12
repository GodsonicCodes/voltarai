export async function startMicVolumeListener(
  onVolume: (volume: number) => void
) {
  // Request microphone with noise suppression
  const stream = await navigator.mediaDevices.getUserMedia({ 
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: false,
      sampleRate: 16000
    } 
  });

  const audioContext = new (window.AudioContext ||
    (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext!)();

  const source = audioContext.createMediaStreamSource(stream);

  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 256;
  analyser.smoothingTimeConstant = 0.8; // Reduced smoothing for more responsive

  source.connect(analyser);

  const data = new Uint8Array(analyser.frequencyBinCount);

  function loop() {
    analyser.getByteFrequencyData(data);

    // Calculate volume with noise reduction
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      // Apply a threshold to reduce noise
      if (data[i] > 5) { // Only count values above noise threshold
        sum += data[i];
      }
    }
    const volume = sum / data.length;

    onVolume(volume); // send volume back to UI

    requestAnimationFrame(loop);
  }

  loop();

  return () => {
    audioContext.close();
    stream.getTracks().forEach((t) => t.stop());
  };
}
