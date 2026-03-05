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
    return setInterval(async () => {
      if (!videoRef.current || !modelsLoaded) return;
      try {
        const detection = await faceapi
          .detectSingleFace(videoRef.current)
          .withFaceLandmarks()
          .withFaceExpressions();
        if (detection) {
          const sorted = Object.entries(detection.expressions)
            .sort(([, a], [, b]) => b - a);
          setEmotion({
            type: sorted[0][0],
            confidence: parseFloat(sorted[0][1].toFixed(2)),
            all: detection.expressions,
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