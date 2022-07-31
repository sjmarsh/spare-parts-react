import React from 'react';
import {
  Routes,
  Route
} from 'react-router-dom';

import Home from './features/home/Home';
import PartList from './features/parts/PartList';
import Counter from './features/counter/Counter';

import './App.css';

import { SideBar } from './components/SideBar';

function App() {
  return (
    <div className="App">
      <div className='page'>
        <SideBar/>
        <main>
          <div className='top-row px-4'>
            <a href='https://redux.js.org/' target="_blank" rel="noreferrer">About</a>
          </div>
          <article className='content px-4'>
            <Routes>
              <Route path="/" element={<Home/>} />
              <Route path="/part-list" element={<PartList />} />
              <Route path="/counter" element={<Counter />} />
            </Routes>    
          </article>
        </main>
      </div>        
    </div>
  );
}

export default App;
