import React from 'react';
import { NavbarComponent } from '../components/Navbar';
import { Divider, Spacer } from '@nextui-org/react';

function Layout({ children }) {
    return (
        <div className='dark text-foreground bg-background h-screen'>
            <NavbarComponent />
            <Divider/>
            <Spacer y={5}/>
            <main>{children}</main>
        </div>
    );
}

export default Layout;