import './App.css';
import { lazy } from 'react';

const RecorderElement = lazy(
  () => import('./components/VideoRecorder/VideoRecorder')
);

export default function App() {
  return (
    <div className="App">
      <RecorderElement timeLimit={120} />
    </div>
  );
}
