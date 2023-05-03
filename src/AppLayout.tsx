import React, { Children } from 'react';
import { Link, Outlet } from 'react-router-dom';

function AppLayout() {
  return (
    <div className="app-layout">
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="navigate">About Us</Link>
          </li>
        </ul>
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
