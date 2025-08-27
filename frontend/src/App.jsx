import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Alert } from 'react-bootstrap'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import { fetchTasks, createTask, updateTask, deleteTask } from './lib/api'
import toast, { Toaster } from 'react-hot-toast'

function App() {
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        loadTasks()
    }, [])

    const loadTasks = async () => {
        try {
            setLoading(true)
            const data = await fetchTasks()
            setTasks(data)
            setError(null)
        } catch (err) {
            setError('Failed to load tasks')
            toast.error('Failed to load tasks')
        } finally {
            setLoading(false)
        }
    }

    const handleCreateTask = async (taskData) => {
        try {
            const newTask = await createTask(taskData)
            setTasks([...tasks, newTask])
            toast.success('Task created successfully!')
        } catch (err) {
            toast.error('Failed to create task')
        }
    }

    const handleUpdateTask = async (id, updates) => {
        try {
            const updatedTask = await updateTask(id, updates)
            setTasks(tasks.map(task => task.id === id ? updatedTask : task))
            toast.success('Task updated successfully!')
        } catch (err) {
            toast.error('Failed to update task')
        }
    }

    const handleDeleteTask = async (id) => {
        try {
            await deleteTask(id)
            setTasks(tasks.filter(task => task.id !== id))
            toast.success('Task deleted successfully!')
        } catch (err) {
            toast.error('Failed to delete task')
        }
    }

    return (
        <div className="App">
            <Toaster position="top-right" />
            <Container className="py-4">
                <Row className="mb-4">
                    <Col>
                        <h1 className="text-center text-primary mb-3">
                            <i className="bi bi-check2-square me-2"></i>
                            ProTracker
                        </h1>
                        <p className="text-center text-muted">Manage your tasks and boost productivity</p>
                    </Col>
                </Row>

                {error && (
                    <Alert variant="danger" dismissible onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                <Row>
                    <Col lg={4} className="mb-4">
                        <TaskForm onSubmit={handleCreateTask} />
                    </Col>
                    <Col lg={8}>
                        <TaskList
                            tasks={tasks}
                            loading={loading}
                            onUpdate={handleUpdateTask}
                            onDelete={handleDeleteTask}
                        />
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default App
