import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import PartList from '../features/parts/PartList';
import Counter from '../features/counter/Counter';

import './Sidebar.css'

export const SideBar = () => {
  return (
    <div className='sidebar flex-column flex-shrink-0'> 

      <div class="top-row ps-3 navbar navbar-dark">
          <div class="container-fluid">
              <Navbar.Brand>Spare Parts</Navbar.Brand>
              <button title="Navigation menu" class="navbar-toggler" >
                  <span class="navbar-toggler-icon"></span>
              </button>
          </div>
      </div>

      <Navbar variant="dark">          
        <Nav className="me-auto">
          <ul>
            <Nav.Item className="px-3">
              <Link className='nav-link' to="/part-list" element={<PartList/>}>
                <span className="oi oi-list" aria-hidden="true"/>Part List
              </Link>
            </Nav.Item>
            <Nav.Item className="px-3">
              <Link className='nav-link' to="/counter" element={<Counter/>}>
              <span className="oi oi-spreadsheet" aria-hidden="true"/>Counter
              </Link>
            </Nav.Item>
          </ul>
        </Nav>
      </Navbar>        
    </div>  
  )
}