import axios from 'axios'

const API_BASE_URL = '/api'

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor for logging
api.interceptors.request.use(
    (config) => {
        console.log('API Request:', config.method?.toUpperCase(), config.url)
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        return response.data
    },
    (error) => {
        console.error('API Error:', error.response?.data || error.message)
        return Promise.reject(error)
    }
)

// Task API functions
export const fetchTasks = async () => {
    const response = await api.get('/tasks')
    return response
}

export const fetchTask = async (id) => {
    const response = await api.get(`/tasks/${id}`)
    return response
}

export const createTask = async (taskData) => {
    const response = await api.post('/tasks', taskData)
    return response
}

export const updateTask = async (id, updates) => {
    const response = await api.patch(`/tasks/${id}`, updates)
    return response
}

export const deleteTask = async (id) => {
    await api.delete(`/tasks/${id}`)
    return true
}

export const updateTaskStatus = async (id, status) => {
    const response = await api.patch(`/tasks/${id}`, { status })
    return response
}

export default api
