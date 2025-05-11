import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const StreamList = () => {
    const [streams, setStreams] = useState([]);
    const [reload, setReload] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8080/video/')
      .then(res => res.json())
      .then(data => setStreams(data));
  }, [reload]);

  const addStream = async () => {
    const res = await fetch('http://localhost:8080/video/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: newUrl }),
    });
    const data = await res.json();
    if (data.slug) setReload(true);
  };

  return (
    <div className="container mt-4">
      <h2>RTSP Streams</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Slug</th>
            <th>URL</th>
            <th>Created</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {streams.map(stream => (
            <tr key={stream.slug}>
              <td>{stream.slug}</td>
              <td>{stream.url}</td>
              <td>{new Date(stream.created).toLocaleString()}</td>
                  <td style={{width:"12%"}}>
                      <div style={{ display: "flex",justifyContent:"space-between" }}>
                      <button className="btn btn-sm btn-primary" onClick={() => navigate(`/stream/${stream.slug}`)}>
                  HLS
                </button>
                <button className="btn btn-sm btn-primary" onClick={() => navigate(`/wsstream/${stream.slug}`)}>
                  MJPEB
                </button>
                      </div>
               
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4">
        <input
          type="text"
          className="form-control"
          placeholder="Enter RTSP URL"
          value={newUrl}
          onChange={e => setNewUrl(e.target.value)}
        />
        <button className="btn btn-success mt-2" onClick={addStream}>
          Add Stream
        </button>
      </div>
    </div>
  );
};

export default StreamList;
