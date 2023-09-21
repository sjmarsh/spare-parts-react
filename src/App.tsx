import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './features/home/Home';
import Login from './features/login/Login';
import Logout from './features/login/Logout';
import PartList from './features/parts/PartList';
import PartReport from './features/parts/PartReport';
import Inventory from './features/inventory/Inventory';
import InventoryReport from './features/inventory/InventoryReport';
import PartSearch from './features/search/PartSearch';
import Counter from './features/counter/Counter';
import AuthrorizedRoute from './components/authorization/AuthorizedRoute';
import SideBar from './components/SideBar';

import UserRoles from './app/constants/userRoles';

import './App.css';


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
              <Route path="/login" element={<Login />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/part-list" element={ <AuthrorizedRoute roles={[UserRoles.Administrator]}><PartList/></AuthrorizedRoute> } />
              <Route path="/part-report" element={ <AuthrorizedRoute roles={[UserRoles.Administrator]}><PartReport/></AuthrorizedRoute> } />
              <Route path="/inventory" element={ <AuthrorizedRoute roles={[UserRoles.Administrator, UserRoles.StocktakeUser]}><Inventory/></AuthrorizedRoute> } />
              <Route path="/inventory-report/:historyMode" element={ <AuthrorizedRoute roles={[UserRoles.Administrator, UserRoles.StocktakeUser]}><InventoryReport/></AuthrorizedRoute> } />
              <Route path="/part-search" element={ <AuthrorizedRoute roles={[UserRoles.Administrator]}><PartSearch/></AuthrorizedRoute> } />
              <Route path="/counter" element={<Counter />} />
            </Routes>    
          </article>
        </main>
      </div>        
    </div>
  );
}

export default App;
