import React, { useState } from 'react';
import Header from './components/Header/Header.jsx';
import MarketData from './components/MarketData/MarketData.jsx';
import Blotter from './components/Blotter/Blotter.jsx';
import './App.scss';

function App() {
  const [blotter, setBlotter] = useState(false);

  return (
    <div className='App'>
      <Header />
      <div className='main-container'>
        <div className='selector'>
          <div
            className={`option${!blotter ? ' active' : ''}`}
            onClick={() => setBlotter(false)}>
            Market Data
          </div>
          <div
            className={`option${blotter ? ' active' : ''}`}
            onClick={() => setBlotter(true)}>
            Blotter
          </div>
        </div>
        {blotter ? <Blotter /> : <MarketData />}
      </div>
    </div>
  );
}

export default App;
