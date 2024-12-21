// import React from 'react'
import { useEffect } from 'react';
import Layout2 from '../layouts/Layout'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const {user } = useAuthStore((state)=> state);
  useEffect(()=>{
    if (user) {
      console.log("User is logged in")
      navigate('/project');
    }
},[user, navigate])
  return (
    <Layout2>
      Welcome to Task Tracker APP.
      <p>This app is designed to help you manage your tasks and projects.</p>
      <p>You can create projects, add tasks to them, and track their progress.</p>
      <p>For every Task you create, you can add subtasks to it on a white board and track their progress.</p>
      <p>You can create graphs to visualize your progress.</p>

    </Layout2>
  )
}

export default Home