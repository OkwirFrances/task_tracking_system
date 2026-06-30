const API_URL = '/api/tasks';
let allTasks = [];
let allLogs = [];
let currentFilter = { status: 'all', priority: 'all', location: 'all' };

document.addEventListener('DOMContentLoaded', () => {
    fetchTasks();
    fetchSummary();
    setupEventListeners();
    populateLocationFilter();
});

async function fetchTasks() {
    try {
        const response = await axios.get(API_URL);
        allTasks = response.data;
        renderGanttChart();
        populateProgressTaskSelect();
    } catch (error) {
        console.error('Error fetching tasks:', error);
        alert('Failed to load tasks. Please check if the backend is running.');
    }
}

async function fetchSummary() {
    try {
        const response = await axios.get(`${API_URL}/summary`);
        const data = response.data;
        document.getElementById('totalTasks').textContent = data.totalTasks || 0;
        document.getElementById('completedTasks').textContent = data.completedTasks || 0;
        document.getElementById('inProgressTasks').textContent = data.inProgressTasks || 0;
        document.getElementById('avgProgress').textContent = `${data.averageProgress || 0}%`;
        if (data.recentLogs) {
            renderActivityFeed(data.recentLogs);
        }
    } catch (error) {
        console.error('Error fetching summary:', error);
    }
}

function renderActivityFeed(logs) {
    const feed = document.getElementById('activityFeed');
    if (!logs || logs.length === 0) {
        feed.innerHTML = '<p style="color: #6c757d; text-align: center;">No recent activity</p>';
        return;
    }
    const actionIcons = {
        'started': '🚀', 'progress-update': '📈', 'completed': '✅',
        'paused': '⏸️', 'resumed': '▶️', 'location-change': '📍',
        'note-added': '📝', 'status-change': '🔄', 'hours-logged': '⏱️'
    };
    feed.innerHTML = logs.map(log => {
        const icon = actionIcons[log.action] || '📌';
        const taskTitle = log.Task ? log.Task.title : 'Unknown Task';
        const location = log.location || 'Not specified';
        return `
            <div class="activity-item">
                <div class="activity-icon">${icon}</div>
                <div class="activity-content">
                    <div class="action">${taskTitle}</div>
                    <div class="description">${escapeHtml(log.description)}</div>
                    <div class="meta">
                        ${formatDate(log.createdAt)}
                        <span class="location-badge">📍 ${escapeHtml(location)}</span>
                        ${log.userName ? `👤 ${escapeHtml(log.userName)}` : ''}
                        ${log.progressValue !== null ? `📊 ${log.progressValue}%` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderGanttChart() {
    const chartContainer = document.getElementById('ganttChart');
    const timelineContainer = document.getElementById('ganttTimeline');
    let filteredTasks = allTasks;
    if (currentFilter.status !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.status === currentFilter.status);
    }
    if (currentFilter.priority !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.priority === currentFilter.priority);
    }
    if (currentFilter.location !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.location === currentFilter.location);
    }
    filteredTasks.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    if (filteredTasks.length === 0) {
        chartContainer.innerHTML = `<div style="text-align:center;padding:40px;color:#6c757d;"><p>No tasks found. Click "Add Task" to create one.</p></div>`;
        timelineContainer.innerHTML = '';
        return;
    }
    const dates = filteredTasks.flatMap(task => [new Date(task.startDate), new Date(task.endDate)]);
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));
    minDate.setDate(minDate.getDate() - 1);
    maxDate.setDate(maxDate.getDate() + 1);
    const totalDays = Math.max(1, (maxDate - minDate) / (1000 * 60 * 60 * 24));
    renderTimeline(minDate, maxDate, totalDays);
    const statusColors = {
        'pending': '#95a5a6', 'in-progress': '#3498db',
        'completed': '#2ecc71', 'delayed': '#e74c3c', 'on-hold': '#f39c12'
    };
    const locationEmojis = {
        'Office': '🏢', 'Remote': '🏠', 'Client Site': '🏢',
        'Home Office': '🏠', 'On-site': '🔧', 'Other': '📍'
    };
    chartContainer.innerHTML = filteredTasks.map(task => {
        const start = new Date(task.startDate);
        const end = new Date(task.endDate);
        const offset = (start - minDate) / (1000 * 60 * 60 * 24);
        const duration = Math.max(0.5, (end - start) / (1000 * 60 * 60 * 24));
        const leftPercent = (offset / totalDays) * 100;
        const widthPercent = (duration / totalDays) * 100;
        const color = task.color || statusColors[task.status] || '#3498db';
        const progress = task.progress || 0;
        const location = task.location || 'Not specified';
        const locationDetails = task.locationDetails || '';
        const locationEmoji = locationEmojis[location] || '📍';
        return `
            <div class="task-row" data-task-id="${task.id}" onclick="showTaskDetails('${task.id}')">
                <div class="task-name">
                    <div class="title">
                        ${escapeHtml(task.title)}
                        <span class="location-tag">${locationEmoji} ${escapeHtml(location)}</span>
                    </div>
                    <div class="subtitle">
                        ${escapeHtml(task.status || 'pending')} • ${escapeHtml(task.priority || 'medium')}
                        <span class="progress-indicator"><span class="fill" style="width: ${progress}%"></span></span>
                        ${progress}%
                    </div>
                    ${task.assignedTo ? `<div class="assigned">👤 ${escapeHtml(task.assignedTo)}</div>` : ''}
                    ${locationDetails ? `<div class="assigned" style="font-size:10px;">📍 ${escapeHtml(locationDetails)}</div>` : ''}
                </div>
                <div class="gantt-bar-container">
                    <div class="gantt-bar" style="left:${leftPercent}%;width:${widthPercent}%;background:${color};" onclick="event.stopPropagation();showTaskDetails('${task.id}')">
                        ${task.title}
                        ${progress > 0 ? `<span class="progress-text">${progress}%</span>` : ''}
                        <div class="task-tooltip">
                            <strong>${escapeHtml(task.title)}</strong><br>
                            📍 ${escapeHtml(location)}${locationDetails ? ` - ${escapeHtml(locationDetails)}` : ''}<br>
                            ${formatDate(task.startDate)} - ${formatDate(task.endDate)}<br>
                            Progress: ${progress}%<br>
                            Status: ${task.status}<br>
                            ${task.assignedTo ? `Assigned: ${task.assignedTo}` : ''}
                        </div>
                    </div>
                    <div class="task-actions">
                        <button class="btn-edit" onclick="event.stopPropagation();editTask('${task.id}')">✏️</button>
                        <button class="btn-danger" onclick="event.stopPropagation();deleteTask('${task.id}')">🗑️</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderTimeline(minDate, maxDate, totalDays) {
    const timelineContainer = document.getElementById('ganttTimeline');
    const days = Math.ceil(totalDays);
    const labels = [];
    for (let i = 0; i <= days; i++) {
        const date = new Date(minDate);
        date.setDate(date.getDate() + i);
        labels.push(date);
    }
    timelineContainer.innerHTML = labels.map(date => `
        <div class="timeline-label">${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
    `).join('');
}

async function showTaskDetails(taskId) {
    try {
        const response = await axios.get(`${API_URL}/${taskId}`);
        const task = response.data;
        const modal = document.getElementById('taskDetailsModal');
        document.getElementById('detailsTitle').textContent = task.title;
        const content = document.getElementById('taskDetailsContent');
        const locationEmojis = {
            'Office': '🏢', 'Remote': '🏠', 'Client Site': '🏢',
            'Home Office': '🏠', 'On-site': '🔧', 'Other': '📍'
        };
        const locationEmoji = locationEmojis[task.location] || '📍';
        let logsHtml = '';
        if (task.ProgressLogs && task.ProgressLogs.length > 0) {
            logsHtml = `
                <div class="progress-logs">
                    <h4>Progress Logs (${task.ProgressLogs.length})</h4>
                    ${task.ProgressLogs.map(log => `
                        <div class="progress-log-item">
                            <div class="log-header">
                                <span>${formatDate(log.createdAt)}</span>
                                <span>${log.userName || 'System'}</span>
                            </div>
                            <div class="log-description">
                                ${escapeHtml(log.description)}
                                ${log.location ? `<span class="location-badge">📍 ${escapeHtml(log.location)}</span>` : ''}
                                ${log.progressValue !== null ? `<span class="location-badge">📊 ${log.progressValue}%</span>` : ''}
                                ${log.hoursSpent ? `<span class="location-badge">⏱️ ${log.hoursSpent}h</span>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            logsHtml = '<p style="color: #6c757d;">No progress logs yet</p>';
        }
        content.innerHTML = `
            <div class="task-details-grid">
                <div class="task-detail-item"><label>Status</label><value>${task.status}</value></div>
                <div class="task-detail-item"><label>Priority</label><value>${task.priority}</value></div>
                <div class="task-detail-item"><label>Progress</label><value>${task.progress}%</value></div>
                <div class="task-detail-item"><label>Location</label><value>${locationEmoji} ${task.location || 'Not specified'}${task.locationDetails ? ` - ${task.locationDetails}` : ''}</value></div>
                <div class="task-detail-item"><label>Start Date</label><value>${formatDate(task.startDate)}</value></div>
                <div class="task-detail-item"><label>End Date</label><value>${formatDate(task.endDate)}</value></div>
                <div class="task-detail-item"><label>Assigned To</label><value>${task.assignedTo || 'Unassigned'}</value></div>
                <div class="task-detail-item"><label>Estimated Hours</label><value>${task.estimatedHours || 0}h</value></div>
            </div>
            <div class="task-detail-item" style="grid-column:1/-1;">
                <label>Description</label>
                <value>${task.description || 'No description'}</value>
            </div>
            ${logsHtml}
        `;
        modal.style.display = 'block';
    } catch (error) {
        console.error('Error fetching task details:', error);
        alert('Failed to load task details');
    }
}

function showAddTaskModal() {
    document.getElementById('modalTitle').textContent = 'Add New Task';
    document.getElementById('taskForm').reset();
    document.getElementById('taskId').value = '';
    const now = new Date();
    const start = new Date(now);
    start.setHours(9, 0, 0, 0);
    const end = new Date(now);
    end.setDate(end.getDate() + 7);
    end.setHours(17, 0, 0, 0);
    document.getElementById('taskStartDate').value = formatDateInput(start);
    document.getElementById('taskEndDate').value = formatDateInput(end);
    document.getElementById('taskModal').style.display = 'block';
}

function editTask(taskId) {
    const task = allTasks.find(t => t.id === taskId);
    if (!task) return;
    document.getElementById('modalTitle').textContent = 'Edit Task';
    document.getElementById('taskId').value = task.id;
    document.getElementById('taskTitle').value = task.title;
    document.getElementById('taskDescription').value = task.description || '';
    document.getElementById('taskStartDate').value = formatDateInput(new Date(task.startDate));
    document.getElementById('taskEndDate').value = formatDateInput(new Date(task.endDate));
    document.getElementById('taskProgress').value = task.progress || 0;
    document.getElementById('taskPriority').value = task.priority || 'medium';
    document.getElementById('taskStatus').value = task.status || 'pending';
    document.getElementById('taskAssignedTo').value = task.assignedTo || '';
    document.getElementById('taskLocation').value = task.location || 'Office';
    document.getElementById('taskLocationDetails').value = task.locationDetails || '';
    document.getElementById('taskEstimatedHours').value = task.estimatedHours || 0;
    document.getElementById('taskModal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function showProgressModal() {
    populateProgressTaskSelect();
    document.getElementById('progressForm').reset();
    document.getElementById('progressModal').style.display = 'block';
}

function populateProgressTaskSelect() {
    const select = document.getElementById('progressTaskId');
    const currentValue = select.value;
    select.innerHTML = '<option value="">Choose a task...</option>';
    allTasks.forEach(task => {
        const option = document.createElement('option');
        option.value = task.id;
        option.textContent = `${task.title} (${task.progress}%) - ${task.location || 'No location'}`;
        select.appendChild(option);
    });
    if (currentValue) select.value = currentValue;
}

function populateLocationFilter() {
    const select = document.getElementById('locationFilter');
    const locations = new Set();
    allTasks.forEach(task => {
        if (task.location) locations.add(task.location);
    });
    select.innerHTML = '<option value="all">All Locations</option>';
    locations.forEach(location => {
        const option = document.createElement('option');
        option.value = location;
        option.textContent = location;
        select.appendChild(option);
    });
}

function applyFilters() {
    currentFilter.status = document.getElementById('statusFilter').value;
    currentFilter.priority = document.getElementById('priorityFilter').value;
    currentFilter.location = document.getElementById('locationFilter').value;
    renderGanttChart();
}

function refreshData() {
    fetchTasks();
    fetchSummary();
}

async function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
        await axios.delete(`${API_URL}/${taskId}`);
        fetchTasks();
        fetchSummary();
    } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task. Please try again.');
    }
}

function setupEventListeners() {
    window.addEventListener('click', (e) => {
        ['taskModal', 'progressModal', 'taskDetailsModal'].forEach(id => {
            const modal = document.getElementById(id);
            if (e.target === modal) modal.style.display = 'none';
        });
    });
    document.getElementById('taskForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const taskId = document.getElementById('taskId').value;
        const taskData = {
            title: document.getElementById('taskTitle').value,
            description: document.getElementById('taskDescription').value,
            startDate: document.getElementById('taskStartDate').value,
            endDate: document.getElementById('taskEndDate').value,
            progress: parseInt(document.getElementById('taskProgress').value) || 0,
            priority: document.getElementById('taskPriority').value,
            status: document.getElementById('taskStatus').value,
            assignedTo: document.getElementById('taskAssignedTo').value,
            location: document.getElementById('taskLocation').value,
            locationDetails: document.getElementById('taskLocationDetails').value,
            estimatedHours: parseFloat(document.getElementById('taskEstimatedHours').value) || 0
        };
        try {
            if (taskId) {
                await axios.put(`${API_URL}/${taskId}`, taskData);
            } else {
                await axios.post(API_URL, taskData);
            }
            closeModal('taskModal');
            fetchTasks();
            fetchSummary();
        } catch (error) {
            console.error('Error saving task:', error);
            alert('Failed to save task. Please try again.');
        }
    });
    document.getElementById('progressForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const taskId = document.getElementById('progressTaskId').value;
        if (!taskId) {
            alert('Please select a task');
            return;
        }
        const progressData = {
            action: 'progress-update',
            description: document.getElementById('progressDescription').value,
            location: document.getElementById('progressLocation').value,
            locationDetails: document.getElementById('progressLocationDetails').value || null,
            progressValue: parseInt(document.getElementById('progressValue').value) || null,
            hoursSpent: parseFloat(document.getElementById('progressHours').value) || 0,
            notes: document.getElementById('progressNotes').value || null,
            userName: document.getElementById('taskAssignedTo')?.value || 'User'
        };
        try {
            await axios.post(`${API_URL}/${taskId}/logs`, progressData);
            closeModal('progressModal');
            fetchTasks();
            fetchSummary();
            alert('Progress logged successfully! ✅');
        } catch (error) {
            console.error('Error logging progress:', error);
            alert('Failed to log progress. Please try again.');
        }
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}

function formatDateInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

window.showAddTaskModal = showAddTaskModal;
window.showProgressModal = showProgressModal;
window.editTask = editTask;
window.deleteTask = deleteTask;
window.showTaskDetails = showTaskDetails;
window.closeModal = closeModal;
window.applyFilters = applyFilters;
window.refreshData = refreshData;
