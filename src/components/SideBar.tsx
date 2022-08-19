import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import './Sidebar.css'

const SideBar = () => {
  
  const [collapseNavMenu, setCollapseNavMenu] = useState(false);
  const [navMenuClass, setNavMenuClass] = useState("");
  const [activeLink, setActiveLink] = useState("");
  
  const toggleNavMenu = () => {
    setCollapseNavMenu(!collapseNavMenu);
    let navMenuClass = collapseNavMenu ? "collapse" : "";
    setNavMenuClass(navMenuClass);
  }

   const updateActiveLink = (e: React.MouseEvent<HTMLAnchorElement>) => {
      setActiveLink(e.currentTarget.id);
   }

  const activeClass = (linkId: string) => {
    return activeLink === linkId ? "active" : "";
  }

  return (
    <div className='sidebar'> 

      <div className="top-row-cust ps-3 navbar navbar-dark">
          <div className="container-fluid">
              <div className="navbar-brand">Spare Parts</div>
              <button title="Navigation menu" className="navbar-toggler" onClick={toggleNavMenu}>
                  <span className="navbar-toggler-icon"></span>
              </button>
          </div>
      </div>

      <div className={navMenuClass}>
          <nav className="flex-column">
          <div className="nav-item-cust px-3">
              <Link id="home" className={`nav-link-cust ${activeClass('home')}`} to="/" onClick={updateActiveLink}>
                <span className="oi oi-home" aria-hidden="true"/>Home
              </Link>
            </div>
            <div className="nav-item-cust px-3">
              <Link id="part-list" className={`nav-link-cust ${activeClass('part-list')}`} to="/part-list" onClick={updateActiveLink}>
                <span className="oi oi-list" aria-hidden="true"/>Part List
              </Link>
            </div>
            <div className="nav-item-cust px-3">
              <Link id="inventory" className={`nav-link-cust ${activeClass('inventory')}`} to="/inventory" onClick={updateActiveLink}>
              <span className="oi oi-spreadsheet" aria-hidden="true"/>Inventory
              </Link>
            </div>
            <div className="nav-item-cust px-3">
              <Link id="counter" className={`nav-link-cust ${activeClass('counter')}`} to="/counter" onClick={updateActiveLink}>
              <span className="oi oi-spreadsheet" aria-hidden="true"/>Counter
              </Link>
            </div>
          </nav>
      </div>        
    </div>  
  )
}

export default SideBar