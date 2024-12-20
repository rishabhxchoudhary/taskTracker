// import React from 'react'
import Layout from '../layouts/Layout'
import { useProjectStore } from '../store/projectStore'

const Home = () => {
  const project = useProjectStore((state) => state.currentProject);
  return (
    <Layout>
        <div>{project.id} {project.name}</div>
    </Layout>
  )
}

export default Home