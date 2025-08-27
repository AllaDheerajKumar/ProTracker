import React, { useState } from 'react'
import { Form, Button, Card, Alert, Row, Col } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

const TaskForm = ({ onSubmit }) => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState(null)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm()

    const onFormSubmit = async (data) => {
        try {
            setIsSubmitting(true)
            setError(null)

            // Format the data
            const taskData = {
                title: data.title,
                description: data.description || '',
                estimated_minutes: data.estimated_minutes ? parseInt(data.estimated_minutes) : null,
                priority: data.priority ? parseInt(data.priority) : 0,
                due_at: data.due_at || null,
                status: 'TODO'
            }

            await onSubmit(taskData)
            reset()
            toast.success('Task created successfully!')
        } catch (err) {
            setError('Failed to create task. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">
                    <i className="bi bi-plus-circle me-2"></i>
                    Create New Task
                </h5>
            </Card.Header>
            <Card.Body>
                {error && (
                    <Alert variant="danger" dismissible onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                <Form onSubmit={handleSubmit(onFormSubmit)}>
                    <Form.Group className="mb-3">
                        <Form.Label>Task Title *</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter task title"
                            {...register('title', { required: 'Title is required' })}
                            isInvalid={!!errors.title}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.title?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Enter task description (optional)"
                            {...register('description')}
                        />
                    </Form.Group>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Estimated Time (minutes)</Form.Label>
                                <Form.Control
                                    type="number"
                                    min="1"
                                    placeholder="30"
                                    {...register('estimated_minutes')}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Priority</Form.Label>
                                <Form.Select {...register('priority')}>
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
                            {...register('due_at')}
                        />
                    </Form.Group>

                    <Button
                        type="submit"
                        variant="primary"
                        className="w-100"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Creating...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-plus-circle me-2"></i>
                                Create Task
                            </>
                        )}
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    )
}

export default TaskForm
