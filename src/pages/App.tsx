import { Suspense, lazy } from 'react';
import { useAppSelector } from '../redux/hooks';

const RecorderElement = lazy(
  () => import('../components/VideoRecorder/VideoRecorder')
);

export default function App() {
  const { streams } = useAppSelector((state) => state.media);
  console.log(streams);

  return (
    <div className="App">
      <Suspense>
        <RecorderElement timeLimit={120} />
      </Suspense>
    </div>
  );
}
