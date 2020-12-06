import React, { useState, useEffect } from 'react';
import './App.css';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

interface AppProps { }

const ffmpeg = createFFmpeg({ log: true });

function App({ }: AppProps) {
  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState<File | string>('');
  const [gif, setGif] = useState<string>('');

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  };

  useEffect(() => {
    load();
  }, []);

  const convertToGif = async () => {
    ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video));
    await ffmpeg.run('-i', 'test.mp4', '-t', '3', '-ss', '40.0', '-f', 'gif', 'out.gif');

    const data = ffmpeg.FS('readFile', 'out.gif');

    const url = URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif' }));
    setGif(url);
  };
  return ready ? (
    <div className="App">
      <br />
      {video && <video autoPlay controls width='250' src={URL.createObjectURL(video)} />}
      <br />
      <br />
      <br />
      <input type="file" onChange={(e: any) => setVideo(e.target.files?.item(0))} />

      <h3>Result</h3>
      <button onClick={convertToGif}>Convert</button>
      <br />
      <br />
      {gif && gif.length > 0 ? <img src={gif} width='250' alt="Wrong Format" /> : <p>Converting..</p>}
    </div>
  ) : <p>Loading...</p>;
}

export default App;
