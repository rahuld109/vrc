import './App.css';
import React, { useRef, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowDown,
  faEllipsisV,
  faPlay,
  faStop,
  faTableCells,
} from '@fortawesome/free-solid-svg-icons';
import StopWatch from './components/StopWatch';
import { UserSection } from './components/UserSection';
import { isBrightnessLow } from './utils';
import GridOverlay from './components/GridOverlay';

type Props = {
  // Declare the props for your component here
};

const LOW_BRIGHTNESS_THRESHOLD = 120;
let interval: number | null | undefined = null;

export const App: React.FC<Props> = (props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [webcamActive, setWebcamActive] = useState(false);
  const [recording, setRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [countdown, setCountdown] = useState(3);
  const [isActiveCountdown, setIsActiveCountdown] = useState(false);
  const [activeGrid, setActiveGrid] = useState(false);

  const [recordedBlobs, setRecordedBlobs] = useState<Blob[]>([]);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const startCountdown = () => {
    interval = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount === 0) {
          clearInterval(interval as number);
          setIsActiveCountdown(false);
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);
  };

  const handleStartWebcam = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        setStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setWebcamActive(true);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleStartRecording = () => {
    if (!webcamActive) {
      alert('Please start the webcam first');
      return;
    }
    if (recording) {
      stopRecording();
    } else {
      const options = { mimeType: 'video/webm;codecs=vp9' };
      const newRecorder = new MediaRecorder(stream as MediaStream, options);
      newRecorder.ondataavailable = handleDataAvailable;

      setTimeout(() => {
        newRecorder.start();
        setRecorder(newRecorder);
        setRecording(true);
      }, 3000);
      setIsActiveCountdown(true);
      startCountdown();
    }
  };

  const handleDataAvailable = (event: BlobEvent) => {
    if (event.data && event.data.size > 0) {
      setRecordedBlobs([...recordedBlobs, event.data]);
    }
  };

  const stopRecording = () => {
    if (recorder) {
      recorder.stop();
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setRecorder(null);
    setRecording(false);
    setWebcamActive(false);
    setCountdown(3);
  };

  const download = () => {
    const blob = new Blob(recordedBlobs, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'recording.webm';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };

  const checkBrightness = () => {
    const canvas = document.createElement('canvas');

    canvas.width = videoRef.current!.videoWidth;
    canvas.height = videoRef.current!.videoHeight;

    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(videoRef.current!, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let sum = 0;
    for (let i = 0; i < imageData.data.length; i += 4) {
      sum += imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2];
    }
    const avg = sum / (imageData.data.length / 4);

    console.log(avg);

    if (isBrightnessLow(avg, LOW_BRIGHTNESS_THRESHOLD)) {
      setAlertMessage('Video is not bright enough');
    } else {
      setAlertMessage(null);
    }
  };

  const handleGrid = () => {
    setActiveGrid(!activeGrid);
  };

  useEffect(() => {
    let interval: number;
    if (recording) {
      interval = setInterval(() => {
        checkBrightness();
      }, 3000);
    }

    return () => clearInterval(interval);
  });

  return (
    <main className='main-container'>
      <div className='video-container'>
        <video className='video-stream' ref={videoRef} autoPlay />
        {webcamActive ? (
          <>
            <GridOverlay active={activeGrid} />

            <StopWatch
              start={recording}
              stop={!recording}
              stopLimit={3}
              stopFunc={stopRecording}
            />

            {alertMessage != null && (
              <div className='alert-message'>{alertMessage}</div>
            )}
            {isActiveCountdown && countdown != 0 && (
              <div className='countdown-overlay'>{countdown}</div>
            )}

            <button className='grid-btn' onClick={handleGrid}>
              <FontAwesomeIcon icon={faTableCells} />
            </button>

            <button className='settings-btn'>
              <FontAwesomeIcon icon={faEllipsisV} />
            </button>

            <button className='open-btn' onClick={handleStartRecording}>
              {recording ? (
                <FontAwesomeIcon icon={faStop} />
              ) : (
                <FontAwesomeIcon icon={faPlay} />
              )}
            </button>
          </>
        ) : (
          <>
            <button className='start-webcam' onClick={handleStartWebcam}>
              Start Webcam
            </button>

            {recordedBlobs.length > 0 && (
              <button className='download-btn' onClick={download}>
                <FontAwesomeIcon icon={faArrowDown} />
              </button>
            )}
          </>
        )}
      </div>

      <UserSection />
    </main>
  );
};
