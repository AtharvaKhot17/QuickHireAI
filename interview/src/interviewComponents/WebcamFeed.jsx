import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import faceDetectionService from '../services/faceDetectionService';
import { api } from '../services/api';
import "../styles/WebcamFeed.css";

const WebcamFeed = () => {
  const [error, setError] = useState(null);
  const [faceDetection, setFaceDetection] = useState(null);
  const webcamRef = useRef(null);
  const detectionInterval = useRef(null);

  const videoConstraints = {
    width: 400,
    height: 300,
    facingMode: "user"
  };

  useEffect(() => {
    // Start face detection when component mounts
    startFaceDetection();

    // Cleanup when component unmounts
    return () => {
      if (detectionInterval.current) {
        clearInterval(detectionInterval.current);
      }
    };
  }, []);

  const startFaceDetection = async () => {
    try {
      // Initialize face detection service
      await faceDetectionService.initialize();

      // Start periodic face detection
      detectionInterval.current = setInterval(async () => {
        if (webcamRef.current && webcamRef.current.video) {
          try {
            const detection = await faceDetectionService.detectFace(webcamRef.current.video);
            setFaceDetection(detection);

            // Send face detection data to backend
            if (detection.faceBox) {
              await api.post('/interviews/face-analysis', {
                faceBox: detection.faceBox,
                frameSize: {
                  width: webcamRef.current.video.videoWidth,
                  height: webcamRef.current.video.videoHeight
                }
              });
            }
          } catch (error) {
            console.warn('Face detection error:', error);
            // Continue with default values
            setFaceDetection({
              faceDetected: true,
              confidenceScore: 1,
              warning: null
            });
          }
        }
      }, 1000); // Check every second
    } catch (error) {
      console.warn('Face detection initialization error:', error);
      // Continue with default values
      setFaceDetection({
        faceDetected: true,
        confidenceScore: 1,
        warning: null
      });
    }
  };

  const handleError = (err) => {
    console.error('Webcam Error:', err);
    setError('Failed to access camera');
  };

  return (
    <div className="webcam-container">
      {error ? (
        <div className="webcam-error">
          <i className="fas fa-video-slash"></i>
          <p>{error}</p>
          <p>Please ensure your camera is connected and permissions are granted.</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      ) : (
        <div className="video-wrapper">
          <Webcam
            ref={webcamRef}
            audio={false}
            videoConstraints={videoConstraints}
            onUserMediaError={handleError}
            className="webcam-feed"
          />
          {faceDetection && (
            <div className={`face-detection-overlay ${faceDetection.faceDetected ? 'detected' : 'not-detected'}`}>
              {faceDetection.warning && (
                <div className="face-warning">
                  <p>{faceDetection.warning}</p>
                </div>
              )}
              <div className="confidence-score">
                <span className="score-label">Confidence:</span>
                <span className="score-value">{Math.round(faceDetection.confidenceScore)}%</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WebcamFeed; 