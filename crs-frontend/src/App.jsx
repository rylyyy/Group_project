import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TaskPage from './page/TaskPage'
import CreateTaskPage from './page/CreateTaskPage'
import DeleteTaskPage from './page/DeleteTaskPage'
import UpdateTaskPage from './page/UpdateTaskPage'

function App() {
  return (
    <>
      <TaskPage></TaskPage>
      <CreateTaskPage></CreateTaskPage>
      <UpdateTaskPage></UpdateTaskPage>
      <DeleteTaskPage></DeleteTaskPage>
    </>
  )
}

export default App
