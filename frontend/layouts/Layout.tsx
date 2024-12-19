import React from 'react';
import { NavbarComponent } from '../components/Navbar';

function Layout({ children }) {
    return (
        <div className='dark text-foreground bg-background h-screen'>
            <NavbarComponent />
            <main>{children}</main>
        </div>
    );
}

export default Layout;