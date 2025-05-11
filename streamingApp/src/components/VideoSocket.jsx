// MjpegViewer.js
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

const MjpegViewer = () => {
  const { slug } = useParams();
  const imgRef = useRef(null);
  const [error, setError] = useState(null);
  const wsRef = useRef(null);
  const [frameURL, setFrameURL] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8080/ws/stream/${slug}/`);
    wsRef.current = ws;

    ws.binaryType = 'arraybuffer';

    ws.onmessage = (event) => {
      const blob = new Blob([event.data], { type: 'image/jpeg' });
      const url = URL.createObjectURL(blob);

      // Avoid memory leaks by revoking previous URL
      if (frameURL) URL.revokeObjectURL(frameURL);

      setFrameURL(url);
    };

    ws.onerror = (err) => {
      setError('WebSocket error: ' + err.message);
    };

    ws.onclose = () => {
      console.log('WebSocket closed');
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (frameURL) URL.revokeObjectURL(frameURL);
    };
  }, [slug]);

  return (
    <div className="container mt-4">
      {error && <div className="alert alert-danger">{error}</div>}
      <div style={{ border: '1px solid #ccc', width: '640px', height: '480px' }}>
        {frameURL ? (
          <img ref={imgRef} src={frameURL} alt="Stream" width="640" height="480" />
        ) : (
          <p>Connecting to stream...</p>
        )}
      </div>
    </div>
  );
};

export default MjpegViewer;
