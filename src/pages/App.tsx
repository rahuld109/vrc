import { Suspense, lazy } from 'react';

const RecorderElement = lazy(
  () => import('../components/VideoRecorder/VideoRecorder')
);

export default function App() {
  return (
    <main>
      <Suspense>
        <RecorderElement timeLimit={120} />
      </Suspense>
    </main>
  );
}
