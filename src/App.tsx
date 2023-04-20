import './App.css';
import { lazy, Suspense } from 'react';

const RecorderElement = lazy(
  () => import('./components/VideoRecorder/VideoRecorder')
);

function App() {
  return (
    <div className="App">
      <RecorderElement timeLimit={120} />
    </div>
  );
}

export default App;
