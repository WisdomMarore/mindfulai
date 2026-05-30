import { useEffect, useRef, useState } from 'react';
import * as faceapi from '@vladmandic/face-api';

export const useEmotionDetection = () => {
  const videoRef = useRef(null);
  const [emotion, setEmotion] = useState(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.tf.setBackend('webgl');
        await faceapi.tf.ready();

        const MODEL_URL = window.location.origin + '/models';

        await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);

        setModelsLoaded(true);
      } catch (err) {
        console.error('Model loading error:', err);
        setError('Failed to load models: ' + err.message);
      }
    };
    loadModels();
  }, []);

  const startDetection = (intervalMs = 2000) => {
    let testNumber = 0;

    return setInterval(async () => {
      if (!videoRef.current || !modelsLoaded) return;
      try {
        testNumber += 1;
        const label = `[MindfulAI] Emotion Detection Latency — Test ${testNumber}`;

        // ⏱ START — emotion detection timer
        console.time(label);
        const detectionStart = performance.now();

        const detection = await faceapi
          .detectSingleFace(videoRef.current)
          .withFaceLandmarks()
          .withFaceExpressions();

        if (detection) {
          const sorted = Object.entries(detection.expressions)
            .sort(([, a], [, b]) => b - a);

          const detectionEnd = performance.now();
          const latency = (detectionEnd - detectionStart).toFixed(2);

          // ⏱ END — log result
          console.timeEnd(label);
          console.log(`%c[MindfulAI] Test ${testNumber} | Emotion: ${sorted[0][0]} | Confidence: ${(sorted[0][1] * 100).toFixed(1)}% | Latency: ${latency}ms`, 'color: #3b82f6; font-weight: bold;');

          setEmotion({
            type: sorted[0][0],
            confidence: parseFloat(sorted[0][1].toFixed(2)),
            all: detection.expressions,
            latency: parseFloat(latency),
            testNumber,
          });
        }
      } catch (err) {
        console.error('Detection error:', err);
      }
    }, intervalMs);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError('Camera access denied. Please allow camera permissions.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
  };

  return { videoRef, emotion, modelsLoaded, error, startDetection, startCamera, stopCamera };
};