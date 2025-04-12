import {useState, useEffect, use} from 'react'
import axios from 'axios'
const API_URL = 'http://localhost:8080/api/tasks';

function TaskPage(){
    const [tasks, setTasks] = useState([]);

    const getTasks = async() =>{
        try{
            const response = await axios.get(API_URL)
            setTasks(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() =>{
        getTasks();
    },[])

    const renderTasks = (tasks) => {
        return tasks.map((task) => {
            return (
                <li key={task.id}>
                    {task.id} - {task.title} - {task.priority} - {task.status} 
                </li>
            )
        })
    }

    return (
        <>
          <h1>Task Dashboard</h1>
          <div>
              {tasks.length === 0 ? <p>No tasks available.</p> : <ul>{renderTasks(tasks)}</ul>}
          </div>
        </>
    );
}

export default TaskPage;