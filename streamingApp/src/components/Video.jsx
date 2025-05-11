import React, { useRef, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const VideoPlayer = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [playlistUrl, setPlaylistUrl] = useState('');

  useEffect(() => {
    fetch(`http://localhost:8080/video/${slug}`)
      .then(res => res.json())
      .then(data => {
        if (data.playlist_url) {
          setPlaylistUrl(`http://localhost:8080${data.playlist_url}`);
        } else {
          alert("Failed to start stream.");
          navigate('/');
        }
      });

    return () => {
      // Stop FFmpeg transcoding on unmount
    //   fetch(`http://localhost:8080/stream/stop/${slug}`, { method: 'POST' });
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [slug]);

  useEffect(() => {
    if (playlistUrl && videoRef.current && !playerRef.current) {
      playerRef.current = videojs(videoRef.current, {
        controls: true,
        autoplay: true,
        preload: 'auto',
        fluid: true,
        sources: [{
          src: playlistUrl,
          type: 'application/x-mpegURL'
        }]
      });
    }
  }, [playlistUrl]);

  return (
    <div className="container mt-4">
      <video ref={videoRef} className="video-js vjs-big-play-centered" />
    </div>
  );
};

export default VideoPlayer;
