import { useMachine } from '@xstate/react';
import { Fragment, useEffect, useRef, useState } from 'react';

import { recorderMachine } from '../../machines/recorderMachine';
import TimerOverlay from '../Timer/Timer';
import PlayImage from '/play.png';
import StopImage from '/stop.png';
import EjectImage from '/eject.png';
import RepeatImage from '/repeat.png';

interface IRecorderProps {
  timeLimit: 120;
}

function VideoRecorder(props: IRecorderProps) {
  const { timeLimit } = props;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [machineState, send] = useMachine(recorderMachine, {
    actions: {},
    services: {},
    context: {
      timerDuration: timeLimit,
    },
  });

  const ejectHandler = () => {
    if (!machineState.context.mediaBlobUrl) return;

    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = machineState.context.mediaBlobUrl;
    a.download = 'recording.webm';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      if (!machineState.context.mediaBlobUrl) return;
      document.body.removeChild(a);
      URL.revokeObjectURL(machineState.context.mediaBlobUrl);
    }, 100);
  };

  useEffect(() => {
    let mediaStream: MediaStream | null;

    if (machineState.context.stream && videoRef.current) {
      console.log('active stream --->', machineState.context.stream);
      mediaStream = machineState.context.stream;
      videoRef.current.srcObject = machineState.context.stream;
    }

    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [machineState.context.stream]);

  return (
    <Fragment>
      <div className="video__wrapper">
        {!machineState.matches('stopped') && (
          <video ref={videoRef} muted autoPlay className="video__preview" />
        )}

        <div className="video__controls">
          {machineState.matches('idle') && (
            <button
              type="button"
              className="green"
              onClick={() => {
                send('START_RECORDING');
              }}
            >
              <img src={PlayImage} alt="start button" />
            </button>
          )}
          {machineState.matches('recording') && (
            <button
              type="button"
              className="red"
              onClick={() => {
                send('STOP_RECORDING');
              }}
            >
              <img src={StopImage} alt="stop button" />
            </button>
          )}
          {machineState.matches('stopped') && (
            <button
              type="button"
              onClick={() => {
                send('RETAKE_VIDEO');
              }}
            >
              <img src={RepeatImage} alt="retake button" />
            </button>
          )}
        </div>

        {machineState.matches('idle') || machineState.matches('recording') ? (
          <TimerOverlay timerDuration={machineState.context.timerDuration} />
        ) : null}

        {machineState.matches('stopped') && (
          <div className="eject__wrapper">
            <button className="green" onClick={ejectHandler}>
              <img src={EjectImage} alt="eject button" />
            </button>
          </div>
        )}
      </div>
    </Fragment>
  );
}

export default VideoRecorder;
