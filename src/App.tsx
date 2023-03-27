import './App.css';
import Recorder from './components/VideoRecorder/VideoRecorder';

function App() {
  return (
    <div className="App">
      <Recorder timeLimit={120} />
    </div>
  );
}

export default App;
