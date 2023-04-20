import { assign, createMachine } from 'xstate';

export interface IRecorderContext {
  stream: MediaStream | null;
  mediaRecorder: MediaRecorder | null;
  mediaType: string | null;
  mediaBlobUrl: string | null;
  timerDuration: number;
  facingMode: 'user' | 'environment';
}

export const INITIAL_RECORDER_CONTEXT: IRecorderContext = {
  stream: null,
  mediaRecorder: null,
  mediaType: null,
  mediaBlobUrl: null,
  timerDuration: 120,
  facingMode: 'user',
};

export const recorderMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QCcwGMD2yJmQOgEsIAbMAYgGUAVAQQCUqB9OgUQGEB5OgEQEkA5AOIBtAAwBdRKAAOGWAQAuBDADspIAB6IATAE4AbHgCMADgDsAVlNmzJvboDM+gDQgAnoge6TxgCwOHKwcjC19RfTMAX0jXVExsXEIScgBZFj4aRho2NhYKCkZBOhp+KnSxSSQQWXklVXUtBF9tVw8EbQsfbTNAoycjUwsh6Nj0LBx8OPGCFSgyVk4eAUFGKl40ugr1GsVlNSrG8zM8cO19bSd9fQczXzNWz11fE9FRI21TB21fRyN9EZAUwSkzG2BmcwWXD4QlW6xYmyMlRkcl29QOiAs1zwZlMJkxDlEt1eJge7X0RmMulEF1uPQCogcAKBEzwzPBlCoHAACsx2FDllsqjs6vtQIcbCdzudLtdaaSzqI8LozFcHCZ9CYTAYTEzQSzYAoMNJpOyKCwmGkMowAKp0AAyguRtT2DUQfWCeC+dg6rxCZlEvnlarwPsJeIsAbM3yiMUBesSBqN0kg83NNAA0ixGAA1XjcFgcR3VFEi10IPphPC+Ey+fxWURPCy6IykkwUiOvQJnGtWOzRWMqDA4eBVZm4bYll3ohAAWhc7kQc5erxXq5XMdG8RZRFIE+daLFiHMJ1C+gsOP0unPFhaC4QgV0IbOstE4Y6Rl1W8SbNme9Ros0RBrh8XoInOCwbkvBxSScbQ-ACfQG18S9dFQz9xgTQ1jXBP9S2nAYIhDCMBgZfRfBCW82m0b4lRVJt-VEG91TI9DgTwRNjUgXCp0PcsgirGtkMJZ8vgseUsWVVV1U1bV+0iIA */
  id: 'recorder',
  predictableActionArguments: true,
  preserveActionOrder: true,
  tsTypes: {} as import('./recorderMachine.typegen').Typegen0,
  context: INITIAL_RECORDER_CONTEXT,
  initial: 'idle',
  states: {
    idle: {
      invoke: {
        src: (ctx) => (callback) => {
          if (ctx.stream !== null) return;
          navigator.mediaDevices
            .getUserMedia({
              audio: true,
              video: {
                facingMode: ctx.facingMode,
              },
            })
            .then((mediaStream) => {
              callback({
                type: 'MEDIA_ACCESS_GRANTED',
                stream: mediaStream,
              });
            })
            .catch((error) => {
              console.log('Webcamera error--->', error);
            });
        },
      },
      on: {
        START_RECORDING: {
          target: 'recording',
          cond: (ctx) => ctx.stream !== null,
        },
        MEDIA_ACCESS_GRANTED: {
          target: 'idle',
          actions: assign({
            stream: (ctx, event) => event.stream,
          }),
        },
      },
    },

    recording: {
      entry: assign((ctx) => {
        if (!ctx.mediaRecorder && ctx.stream) {
          try {
            try {
              ctx.mediaRecorder = new MediaRecorder(ctx.stream, {
                mimeType: 'video/webm;codecs=vp9,opus',
              });
            } catch (error) {
              ctx.mediaRecorder = new MediaRecorder(ctx.stream, {
                mimeType: 'video/mp4',
              });
            }
          } catch (error) {
            /* Firefox doesn't support video/webm;codecs=vp9,opus and video/mp4 mimeType so want to make another mimetype */
            ctx.mediaRecorder = new MediaRecorder(ctx.stream, {
              mimeType: 'video/webm',
            });
          }
          ctx.mediaType = ctx.mediaRecorder.mimeType;
          ctx.mediaRecorder.start();
        }

        return ctx;
      }),
      invoke: {
        src: (ctx) => (callback) => {
          const interval = setInterval(() => {
            callback('RECORDING_TIMER');
          }, 1000);

          return () => {
            clearInterval(interval);
          };
        },
      },

      on: {
        RECORDING_TIMER: [
          {
            target: 'stopped',
            cond: (ctx) => ctx.timerDuration === 1,
            actions: assign({ timerDuration: 0 }),
          },
          {
            actions: assign({
              timerDuration: (ctx) => ctx.timerDuration - 1,
            }),
          },
        ],
        STOP_RECORDING: [
          {
            target: 'stopping',
          },
        ],
      },
    },
    stopping: {
      entry: assign((ctx) => {
        if (ctx.mediaRecorder && ctx.mediaRecorder.state !== 'inactive') {
          ctx.mediaRecorder.stop();
        }

        return ctx;
      }),
      invoke: {
        src: (ctx) => (callback) => {
          if (!ctx.mediaBlobUrl && ctx.mediaRecorder) {
            ctx.mediaRecorder.ondataavailable = (event) => {
              try {
                if (event.data && event.data.size > 0) {
                  const videoUrl = URL.createObjectURL(event.data);
                  callback({ type: 'SET_MEDIA_URL', mediaBlobUrl: videoUrl });
                }
              } catch (error) {
                console.log('Error generating URL', error);
              }
            };
          }

          return () => {
            if (ctx.stream !== null) {
              ctx.stream.getTracks().forEach((track) => track.stop());
            }
          };
        },
      },
      on: {
        SET_MEDIA_URL: {
          target: 'stopped',
          actions: assign({
            mediaBlobUrl: (_, event) => {
              return event.mediaBlobUrl;
            },
          }),
        },
      },
    },
    stopped: {
      on: {
        RETAKE_VIDEO: {
          target: 'idle',
          actions: assign(INITIAL_RECORDER_CONTEXT),
        },
      },
    },
  },
});
