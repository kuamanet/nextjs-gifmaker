import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'
import { useEffect, useState } from 'react';

const ffmpeg = createFFmpeg({ log: true });

export default function Home() {

  const [ready, setReady] = useState();
  const [video, setVideo] = useState();
  const [gif, setGif] = useState();

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  }

  useEffect(() => {
    load();
  }, [])


  const convertToGif = async () => {
    // Write the file to memory 
    ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video));

    // Run the FFMpeg command
    // '-i' is for the input file, the '-t' is for the time of the video to be, '-ss' starting seconds
    // '-f' we use it to encode that is a gif file
    await ffmpeg.run('-i', 'test.mp4', '-t', '2.5', '-ss', '2.0', '-f', 'gif', 'out.gif');

    // Read the result
    const data = ffmpeg.FS('readFile', 'out.gif');

    // Create a URL
    const url = URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif' }));

    setGif(url);
  }

  return ready ? (
    <div className={styles.container}>
      <Head>
        <title>Convert a video into a Gif</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>
          Convert a video into a gif
        </h1>
        <div className="Home">

          {video && <div className={styles.card}><video
            controls
            width="500"
            src={URL.createObjectURL(video)}>
          </video></div>}

          <center><input type="file" onChange={(e) => setVideo(e.target.files?.item(0))} /></center>
          <center><h1>Result</h1></center>
          <center><button className={styles.button} onClick={convertToGif}>Convert</button></center>
          {gif && <div className={styles.card}><img src={gif} width="500" /></div>}

        </div>

      </main>
    </div>
  ) : (<p>Loading...</p>);
}