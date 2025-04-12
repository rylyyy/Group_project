import { useState, useEffect} from 'react'
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/task';

function CreateTaskPage() {
    const [taskTitle, setTaskTitle] = useState(null);
    const [taskPriority, setTaskPriority] = useState(null);
    const [taskStatus, setTaskStatus] = useState(null);


    const onTaskTitleChange = (event) =>{
        setTaskTitle(event.target.value);
    }

    const onTaskPriorityChange = (event) =>{
        setTaskPriority(event.target.value);
    }

    const onTaskStatusChange = (event) =>{
        setTaskStatus(event.target.value);
    }

    const createTask = async()=>{
        const task = {
            title: taskTitle,
            priority: taskPriority,
            status: taskStatus
        }
        axios.post(API_URL, task)
    }

    return (
        <>
            <h2>Create Task</h2>
            <div>
                <form>
                    <div>
                        <label>Title</label>
                        <input type='text' name='title' onChange={onTaskTitleChange}></input>
                    </div>
                    <div>
                        <label>Priority</label>
                        <select name='priority' onChange={onTaskPriorityChange}>
                            <option value=""></option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>
                    <div>
                        <label>Status</label>
                        <select name='status' onChange={onTaskStatusChange}>
                            <option value=""></option>
                            <option value="Hold">Hold</option>
                            <option value="Not Completed">Not Completed</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                    <div>
                        <button type='submit' onClick={createTask}>Create Task</button>
                    </div>
                </form>
            </div>
        </>
    );
}
export default CreateTaskPage;