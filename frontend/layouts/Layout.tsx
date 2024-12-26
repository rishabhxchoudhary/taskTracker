import React from 'react';
import { NavbarComponent } from '../components/Navbar';
import { Divider } from '@nextui-org/react';
import { Toaster } from 'sonner'
import { TourProvider } from '@reactour/tour'
import { useProjectStore } from '../store/projectStore';
import {  useNavigate } from 'react-router-dom'
function Layout({ children }) {
    const redirect = useNavigate();
    const [step, setStep] = React.useState(0);
    const setSelectedTab = useProjectStore((state) => state.setSelectedTab);
    const setCurrentStep = (step: number)=>{
        if (step === 2) {
          redirect("/project");
          setSelectedTab("list");
        } else if (step === 3) {
          redirect("/project/sample");
        } else if (step === 4) {
          redirect("/project", { replace: true });
          setSelectedTab("kanban");
        } else if (step === 5) {
          setSelectedTab("pomodoro");
        } else {
          redirect("/project");
        }
      setTimeout(() => {
        setStep(step);
      }, 50);
      
    }

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
          selector: '#whiteboard',
          content:<div className="text-sm text-black">
            This is the white board. You can draw here.
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
        <div className='flex flex-col min-w-screen max-w-screen overflow-auto'  style={{ minHeight: "100vh"}}>
            <TourProvider currentStep={step} setCurrentStep={setCurrentStep}  steps={steps}>
                <Toaster/>
                <NavbarComponent />
                <Divider/>
                <main className='flex-1 max-w-7xl mx-auto p-4'>{children}</main>
            </TourProvider>
        </div>
    );
}

export default Layout;