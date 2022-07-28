import React from 'react';
import {
  Routes,
  Route
} from 'react-router-dom';

import PartList from './features/parts/PartList';
import Counter from './features/counter/Counter';

import './App.css';

import { SideBar } from './components/SideBar';

function App() {
  return (
    <div className="App">
      <div className='page'>
        <SideBar/>
        <div className='content flex-column'>
          <Routes>
            <Route path="/part-list" element={<PartList />} />
            <Route path="/counter" element={<Counter />} />
          </Routes>    
        </div>
      </div>        
    </div>
  );
}

export default App;
