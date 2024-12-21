import React from 'react';
import { NavbarComponent } from '../components/Navbar';
import { Divider } from '@nextui-org/react';
import { Toaster } from 'sonner'
function Layout({ children }) {
    return (
        <div className='dark text-foreground bg-background flex flex-col'  style={{ minHeight: "100vh"}}>
            <Toaster/>
            <NavbarComponent />
            <Divider/>
            <main className='flex-1'>{children}</main>
        </div>
    );
}

export default Layout;