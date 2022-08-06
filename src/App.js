import logo from './logo.svg';
import './App.css';
import GameStateTracker
 from './components/GameStateTracker';
 import WinScreen from './components/WinScreen';

function App() {
  return (
    <div className="App">
      <GameStateTracker />
      <WinScreen />
    </div>
  );
}

export default App;
