import './App.css';
import VideoPlayer from './components/Video';
import { Route, Routes } from 'react-router-dom';
import StreamList from './components/Streamlist';
import MjpegViewer from './components/VideoSocket';

function App() {
  

  return (
    <>
      <h2>Custom HLS Live Streaming App</h2>
      <Routes>
      <Route path="/" element={<StreamList />} />
        <Route path="/stream/:slug" element={<VideoPlayer />} />
        <Route path="/wsstream/:slug" element={<MjpegViewer />} />
    </Routes>
    </>
  )
}

export default App
