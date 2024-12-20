import React from 'react'
import Layout from '../layouts/Layout'
import { useProjectStore } from '../store/projectStore'

const Project = () => {
  const project = useProjectStore((state) => state.currentProject);
  return (
    <Layout>
        <div>
          Project Name: {project?.name}<br/>
          Project Description: {project?.description}
        </div>
        
    </Layout>
  )
}

export default Project