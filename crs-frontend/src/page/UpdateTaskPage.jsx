import { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/tasks';

function UpdateTaskPage() {
    const [taskId, setTaskId] = useState('');
    const [taskTitle, setTaskTitle] = useState('');
    const [taskPriority, setTaskPriority] = useState('');
    const [taskStatus, setTaskStatus] = useState('');


    const onTaskIdChange = (event) => {
        setTaskId(event.target.value);
    };

    const onTaskTitleChange = (event) => {
        setTaskTitle(event.target.value);
    };

    const onTaskPriorityChange = (event) => {
        setTaskPriority(event.target.value);
    };

    const onTaskStatusChange = (event) => {
        setTaskStatus(event.target.value);
    };

    const updateTask = async (event) => {
        try {
            const task = {
                title: taskTitle,
                priority: taskPriority,
                status: taskStatus
            };
            await axios.put(`${API_URL}/${taskId}`, task);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <h2>Update Task</h2>
            <div>
                <form>
                    <div>
                        <label>Task ID</label>
                        <input type='text' name='taskId' onChange={onTaskIdChange}></input>
                    </div>
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
                        <button type='submit' onClick={updateTask}>Update Task</button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default UpdateTaskPage;
