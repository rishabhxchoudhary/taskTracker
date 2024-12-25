import React, { useEffect } from 'react';
import { NavbarComponent } from '../components/Navbar';
import { Divider } from '@nextui-org/react';
import { Toaster } from 'sonner'
import { TourProvider } from '@reactour/tour'
import { useProjectStore } from '../store/projectStore';
function Layout({ children }) {
    const [currentStep, setCurrentStep] = React.useState(0);
    const setSelectedTab = useProjectStore((state) => state.setSelectedTab);
    useEffect(()=>{
        if (currentStep === 2) {
            setSelectedTab("list");
            return
        }
        if (currentStep === 3) {
            setSelectedTab("kanban");
            console.log("onboarding complete")
        }
        if (currentStep === 4) {
            setSelectedTab("pomodoro");
            console.log("onboarding complete")
        }
    },[currentStep, setSelectedTab])
    const steps = [
        {
          selector: '#projects',
          content: <div className="text-sm text-black">
            This is the projects section. You can create and delete projects here.
            Select a project to see its tasks.
          </div>,
        },
        {
          selector: '#tabs',
          content:<div className="text-sm text-black">
            There are three tabs: List, Kanban Board, and Pomodoro Timer. Click on them to switch between them.
          </div>,
        },
        {
          selector: '#taskstable',
          content:<div className="text-sm text-black">
            This is the task table. You can create, update, and delete tasks here.
            Click on a row to open the white board.
          </div>,
        },
        {
          selector: '#kanbanboard',
          content:<div className="text-sm text-black">
            This is the kanban board. You can drag and drop tasks between columns.
          </div>,
        },
        {
          selector: '#timer',
          content:<div className="text-sm text-black">
            This is the pomodoro timer. You can start, stop, and reset the timer here.
          </div>,
        }
      ]
    return (
        <div className='flex flex-col'  style={{ minHeight: "100vh"}}>
            <TourProvider currentStep={currentStep} setCurrentStep={setCurrentStep}  steps={steps}>
                <Toaster/>
                <NavbarComponent />
                <Divider/>
                <main className='flex-1 max-w-7xl mx-auto p-4'>{children}</main>
            </TourProvider>
        </div>
    );
}

export default Layout;