import { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/tasks';

function DeleteTaskPage() {
    const [taskId, setTaskId] = useState('');

    const onTaskIdChange = (event) => {
        setTaskId(event.target.value);
    };

    const deleteTask = async (event) => {
        try {
            await axios.delete(`${API_URL}/${taskId}`);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <h2>Delete Task</h2>
            <div>
                <form>
                    <div>
                        <label>Task ID</label>
                        <input type='text' name='taskId' onChange={onTaskIdChange}></input>
                    </div>
                    <div>
                        <button type='submit' onClick={deleteTask}>Delete Task</button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default DeleteTaskPage;
