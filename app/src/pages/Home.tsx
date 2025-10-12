import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store/store';
import { getUserTasks, resetToggleSubtask, toggleSubtask } from '../features/userSlice';
import AddTasks from '../Modal/AddTask';
import AddSubtask from '../Modal/AddSubtasks';

interface Task {
    id: number;
    title: string;
    subtasks: Subtask[];
}

interface Subtask {
    id: number;
    text: string;
    isChecked: boolean;
}

const Home: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { tasks, loading, error, toggle } = useSelector((state: RootState) => state.user);
    const [openTask, setOpenTask] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showSubModal, setShowSubModal] = useState(false);

    const token = sessionStorage.getItem('token');

    useEffect(() => {
        if (token) dispatch(getUserTasks({ token }));
        if (toggle) {
            dispatch(resetToggleSubtask());
        }
    }, [dispatch, token, toggle]);

    const handleAccordionToggle = (taskId: number) => {
        setOpenTask(openTask === taskId ? null : taskId);
    };

    const handleSubtaskToggle = (subtaskId: number) => {
        dispatch(toggleSubtask({ token: token as string, subtaskId: subtaskId }));
    };

    console.log(tasks);


    return (
        <div className="min-h-screen bg-gray-100 py-10 px-5">
            <div className='flex justify-between items-center px-5'> 
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
                    Task Dashboard
                </h1>
                <button onClick={() => setShowModal(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                    Add Task</button>
            </div>
            <AddTasks isOpen={showModal} onClose={() => setShowModal(false)} />


            {tasks.length === 0 && <p className="text-center">No Tasks Found</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            <div className="max-w-2xl mx-auto space-y-4">
                {tasks.map((task: Task) => (
                    <div
                        key={task.id}
                        className="bg-white shadow rounded-xl overflow-hidden border border-gray-200"
                    >
                        <button
                            onClick={() => handleAccordionToggle(task.id)}
                            className="w-full text-left px-5 py-4 font-semibold text-lg text-gray-800 flex justify-between items-center hover:bg-gray-50"
                        >
                            {task.title}
                            <span className="text-gray-500">{openTask === task.id ? '−' : '+'}</span>
                        </button>

                        {openTask === task.id && (
                            <div className="px-6 pb-4 space-y-2">
                                {task.subtasks.map((subtask: Subtask) => (
                                    <label
                                        key={subtask.id}
                                        className="flex items-center space-x-3 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={subtask.isChecked}
                                            onChange={() => handleSubtaskToggle(subtask.id)}
                                            className="w-5 h-5 accent-blue-600"
                                        />
                                        <span
                                            className={`${subtask.isChecked
                                                ? 'line-through text-gray-500'
                                                : 'text-gray-800'
                                                }`}
                                        >
                                            {subtask.text}
                                        </span>
                                    </label>
                                ))}
                                <button
                                    onClick={() => setShowSubModal(true)}
                                    className=" bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-1 rounded"
                                >
                                    Add Subtask
                                </button>
                                <AddSubtask isOpen={showSubModal} onClose={() => setShowSubModal(false)} taskId={task.id} />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
