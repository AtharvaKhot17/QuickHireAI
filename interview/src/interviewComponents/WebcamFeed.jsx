import React, { useState } from 'react';
import Webcam from 'react-webcam';
import "../styles/WebcamFeed.css";

const WebcamFeed = () => {
  const [error, setError] = useState(null);

  const videoConstraints = {
    width: 400,
    height: 300,
    facingMode: "user"
  };

  const handleError = (err) => {
    console.error('Webcam Error:', err);
    setError('Failed to access camera');
  };

  if (error) {
    return (
      <div className="webcam-error">
        <p>{error}</p>
        <button onClick={() => setError(null)}>Retry Camera</button>
        <style jsx>{`
          .webcam-error {
            width: 400px;
            height: 300px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #2c2c2c;
            color: white;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
          }

          button {
            margin-top: 10px;
            padding: 8px 16px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }

          button:hover {
            background: #45a049;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="webcam-feed">
      <Webcam
        audio={false}
        width={400}
        height={300}
        videoConstraints={videoConstraints}
        mirrored={true}
        onUserMediaError={handleError}
      />
      <style jsx>{`
        .webcam-feed {
          width: 400px;
          height: 300px;
          overflow: hidden;
          border-radius: 8px;
          background: #000;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .webcam-feed video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      `}</style>
    </div>
  );
};

export default WebcamFeed; 