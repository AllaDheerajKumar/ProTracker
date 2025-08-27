import React, { useState } from 'react'
import { Card, Badge, Button, Dropdown, Spinner, Alert, Modal, Form, Row, Col } from 'react-bootstrap'
import { formatDistanceToNow } from 'date-fns'

const TaskList = ({ tasks, loading, onUpdate, onDelete }) => {
    const [editingTask, setEditingTask] = useState(null)
    const [showEditModal, setShowEditModal] = useState(false)
    const [editForm, setEditForm] = useState({})

    const handleEdit = (task) => {
        setEditingTask(task)
        setEditForm({
            title: task.title,
            description: task.description || '',
            estimated_minutes: task.estimated_minutes || '',
            priority: task.priority || 0,
            due_at: task.due_at ? new Date(task.due_at).toISOString().slice(0, 16) : '',
            status: task.status
        })
        setShowEditModal(true)
    }

    const handleSaveEdit = async () => {
        try {
            await onUpdate(editingTask.id, editForm)
            setShowEditModal(false)
            setEditingTask(null)
        } catch (err) {
            console.error('Failed to update task:', err)
        }
    }

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await onUpdate(taskId, { status: newStatus })
        } catch (err) {
            console.error('Failed to update status:', err)
        }
    }

    const getPriorityBadge = (priority) => {
        const variants = ['secondary', 'info', 'warning', 'danger']
        const labels = ['Low', 'Medium', 'High', 'Urgent']
        return <Badge bg={variants[priority]}>{labels[priority]}</Badge>
    }

    const getStatusBadge = (status) => {
        const variants = {
            'TODO': 'secondary',
            'IN_PROGRESS': 'primary',
            'DONE': 'success'
        }
        return <Badge bg={variants[status]}>{status.replace('_', ' ')}</Badge>
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'No due date'
        try {
            return formatDistanceToNow(new Date(dateString), { addSuffix: true })
        } catch {
            return 'Invalid date'
        }
    }

    if (loading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p className="mt-2">Loading tasks...</p>
            </div>
        )
    }

    if (tasks.length === 0) {
        return (
            <Card className="text-center py-5">
                <Card.Body>
                    <i className="bi bi-inbox display-1 text-muted"></i>
                    <h4 className="mt-3">No tasks yet</h4>
                    <p className="text-muted">Create your first task to get started!</p>
                </Card.Body>
            </Card>
        )
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Your Tasks ({tasks.length})</h4>
                <div className="d-flex gap-2">
                    <Badge bg="secondary" className="px-3 py-2">
                        TODO: {tasks.filter(t => t.status === 'TODO').length}
                    </Badge>
                    <Badge bg="primary" className="px-3 py-2">
                        In Progress: {tasks.filter(t => t.status === 'IN_PROGRESS').length}
                    </Badge>
                    <Badge bg="success" className="px-3 py-2">
                        Done: {tasks.filter(t => t.status === 'DONE').length}
                    </Badge>
                </div>
            </div>

            <div className="row g-3">
                {tasks.map((task) => (
                    <div key={task.id} className="col-12">
                        <Card className={`task-card h-100 status-${task.status.toLowerCase().replace('_', '-')}`}>
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <h6 className="card-title mb-0">{task.title}</h6>
                                    <Dropdown>
                                        <Dropdown.Toggle variant="outline-secondary" size="sm">
                                            <i className="bi bi-three-dots"></i>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={() => handleEdit(task)}>
                                                <i className="bi bi-pencil me-2"></i>Edit
                                            </Dropdown.Item>
                                            <Dropdown.Divider />
                                            <Dropdown.Item
                                                onClick={() => handleStatusChange(task.id, 'TODO')}
                                                disabled={task.status === 'TODO'}
                                            >
                                                <i className="bi bi-circle me-2"></i>Mark as TODO
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                                onClick={() => handleStatusChange(task.id, 'IN_PROGRESS')}
                                                disabled={task.status === 'IN_PROGRESS'}
                                            >
                                                <i className="bi bi-arrow-clockwise me-2"></i>Mark as In Progress
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                                onClick={() => handleStatusChange(task.id, 'DONE')}
                                                disabled={task.status === 'DONE'}
                                            >
                                                <i className="bi bi-check-circle me-2"></i>Mark as Done
                                            </Dropdown.Item>
                                            <Dropdown.Divider />
                                            <Dropdown.Item
                                                variant="danger"
                                                onClick={() => onDelete(task.id)}
                                                className="text-danger"
                                            >
                                                <i className="bi bi-trash me-2"></i>Delete
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>

                                {task.description && (
                                    <p className="card-text text-muted small mb-2">{task.description}</p>
                                )}

                                <div className="d-flex flex-wrap gap-2 align-items-center">
                                    {getStatusBadge(task.status)}
                                    {getPriorityBadge(task.priority)}
                                    {task.estimated_minutes && (
                                        <Badge bg="info">
                                            <i className="bi bi-clock me-1"></i>
                                            {task.estimated_minutes}m
                                        </Badge>
                                    )}
                                    {task.due_at && (
                                        <Badge bg="warning" text="dark">
                                            <i className="bi bi-calendar me-1"></i>
                                            Due {formatDate(task.due_at)}
                                        </Badge>
                                    )}
                                </div>

                                <small className="text-muted d-block mt-2">
                                    Created {formatDate(task.created_at)}
                                </small>
                            </Card.Body>
                        </Card>
                    </div>
                ))}
            </div>

            {/* Edit Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={editForm.title || ''}
                                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={editForm.description || ''}
                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            />
                        </Form.Group>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Estimated Time (minutes)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={editForm.estimated_minutes || ''}
                                        onChange={(e) => setEditForm({ ...editForm, estimated_minutes: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Priority</Form.Label>
                                    <Form.Select
                                        value={editForm.priority || 0}
                                        onChange={(e) => setEditForm({ ...editForm, priority: parseInt(e.target.value) })}
                                    >
                                        <option value="0">Low</option>
                                        <option value="1">Medium</option>
                                        <option value="2">High</option>
                                        <option value="3">Urgent</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Due Date</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={editForm.due_at || ''}
                                onChange={(e) => setEditForm({ ...editForm, due_at: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Status</Form.Label>
                            <Form.Select
                                value={editForm.status || 'TODO'}
                                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                            >
                                <option value="TODO">TODO</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="DONE">Done</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSaveEdit}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default TaskList
