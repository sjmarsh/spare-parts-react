import React from 'react';
import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import { PartList } from './features/parts/PartList';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
       
        {/* <img src={logo} className="App-logo" alt="logo" />
        <Counter /> */}
        <PartList />
       
      </header>
    </div>
  );
}

export default App;
