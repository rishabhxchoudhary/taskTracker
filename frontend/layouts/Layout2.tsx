import React from 'react';
import { NavbarComponent } from '../components/Navbar2';

function Layout({ children }) {
    return (
        <div className='flex flex-col'  style={{ minHeight: "100vh"}}>
            <NavbarComponent />
            <main className='flex-1 max-w-7xl mx-auto p-4'>{children}</main>
        </div>
    );
}

export default Layout;