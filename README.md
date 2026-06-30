# Task Tracking System

A full-stack web application for managing, tracking, and monitoring project tasks with real-time progress updates, location-based tracking, and comprehensive task analytics.

## 📋 Features

### Task Management
- **Create & Edit Tasks** - Add new tasks with detailed information
- **Task Status Tracking** - Monitor task status (Pending, In Progress, Completed, Delayed, On Hold)
- **Priority Levels** - Set task priority (Low, Medium, High)
- **Progress Tracking** - Update and visualize task completion percentage (0-100%)
- **Date Management** - Define start and end dates for tasks

### Advanced Features
- **Gantt Chart Visualization** - Visual timeline representation of tasks
- **Location Tracking** - Track tasks by location (Office, Remote, Client Site, Home Office, On-site)
- **Progress Logs** - Maintain detailed logs of task progress with timestamps
- **Activity Feed** - Real-time activity updates with action icons
- **Task Assignment** - Assign tasks to team members
- **Hours Tracking** - Log hours spent on tasks
- **Filtering & Sorting** - Filter tasks by status, priority, and location

### Dashboard Analytics
- **Task Summary** - Total, completed, and in-progress task counts
- **Average Progress** - Calculate overall project progress
- **Recent Activity** - View recent task updates and logs
- **Task Details Modal** - Comprehensive task information view

## 🏗️ Architecture

### Tech Stack
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla) with Axios
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL (Sequelize ORM)
- **Containerization**: Docker & Docker Compose
- **Web Server**: Nginx (frontend)

### Project Structure

```
task_tracking_system/
├── frontend/
│   ├── index.html          # Main HTML file
│   ├── app.js              # Frontend logic & API calls
│   ├── style.css           # Styling
│   ├── nginx.conf          # Nginx configuration
│   ├── Dockerfile          # Docker image for frontend
│   └── .gitignore
│
├── backend/
│   ├── src/
│   │   ├── index.js                 # Express app setup & server
│   │   ├── config/
│   │   │   └── database.js          # Sequelize configuration
│   │   ├── models/                  # Database models
│   │   ├── controllers/             # Request handlers
│   │   ├── routes/
│   │   │   └── taskRoutes.js        # API endpoints
│   │   └── middleware/              # Custom middleware
│   ├── package.json        # Backend dependencies
│   ├── Dockerfile          # Docker image for backend
│   └── .gitignore
│
├── init-db/
│   └── init.sql            # Database initialization script
│
├── docker-compose.yml      # Multi-container orchestration
└── .gitignore

```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (for local development)
- Docker & Docker Compose (for containerized setup)
- PostgreSQL 15+ (optional, if running locally)

### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/OkwirFrances/task_tracking_system.git
cd task_tracking_system

# Build and start containers
docker-compose up --build

# Access the application
# Frontend: http://localhost:80
# Backend API: http://localhost:5000
# Health check: http://localhost:5000/health
```

### Option 2: Local Development

#### Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=task_tracker
DB_USER=postgres
DB_PASSWORD=postgres123
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
EOF

# Start PostgreSQL (if not running)
# Then run the server
npm run dev  # For development with auto-reload
# or
npm start    # For production
```

#### Frontend Setup
```bash
cd frontend

# Open index.html in your browser or serve with a local server
# Python 3
python -m http.server 8000

# Then navigate to http://localhost:8000
```

## 📡 API Endpoints

### Base URL
`http://localhost:5000/api/tasks`

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all tasks |
| GET | `/:id` | Get specific task by ID |
| POST | `/` | Create a new task |
| PUT | `/:id` | Update an existing task |
| DELETE | `/:id` | Delete a task |
| GET | `/:taskId/logs` | Get progress logs for a task |
| POST | `/:taskId/logs` | Add a progress log to a task |
| GET | `/summary` | Get dashboard summary statistics |
| GET | `/health` | Health check endpoint |

### Task Object Structure
```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "status": "pending|in-progress|completed|delayed|on-hold",
  "priority": "low|medium|high",
  "progress": 0-100,
  "startDate": "ISO 8601 date",
  "endDate": "ISO 8601 date",
  "assignedTo": "string",
  "location": "Office|Remote|Client Site|Home Office|On-site|Other",
  "locationDetails": "string",
  "estimatedHours": "number",
  "color": "hex color code"
}
```

### Progress Log Structure
```json
{
  "action": "progress-update|started|completed|paused|resumed|status-change|location-change",
  "description": "string",
  "location": "string",
  "locationDetails": "string",
  "progressValue": 0-100 | null,
  "hoursSpent": "number",
  "userName": "string"
}
```

## 🎨 Frontend Features

### Gantt Chart
- Visual timeline of all tasks
- Color-coded by status
- Drag-and-drop capable (with customization)
- Shows progress percentage
- Location badges with emojis
- Task tooltips with detailed information

### Filters & Controls
- **Status Filter**: Filter by task status
- **Priority Filter**: Filter by priority level
- **Location Filter**: Filter by work location
- **Refresh Button**: Real-time data refresh
- **Add Task**: Quick task creation
- **Log Progress**: Record task progress updates

### Responsive Design
- Clean, modern UI with smooth animations
- Mobile-friendly responsive layout
- Dark/light theme compatible
- Accessible color contrasts

## 🗄️ Database Schema

### Tables
- **Tasks** - Core task information
- **ProgressLogs** - Progress update history
- **Users** - Team member information (if implemented)

### Key Relationships
- One Task has Many ProgressLogs
- One User has Many Tasks (assignments)

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
NODE_ENV=production
PORT=5000
DB_HOST=postgres
DB_PORT=5432
DB_NAME=task_tracker
DB_USER=postgres
DB_PASSWORD=postgres123
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

#### Docker Compose
Edit `docker-compose.yml` to customize:
- Database credentials
- Port mappings
- Volume mounts
- Environment variables

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
docker ps

# View container logs
docker-compose logs postgres
docker-compose logs backend

# Rebuild containers
docker-compose down
docker-compose up --build
```

### Backend Not Responding
```bash
# Check if backend service is running
curl http://localhost:5000/health

# View backend logs
docker-compose logs backend

# Restart backend
docker-compose restart backend
```

### Frontend Cannot Reach Backend
- Verify backend is running: `http://localhost:5000/health`
- Check CORS is enabled in backend
- Ensure Docker network is properly configured
- Check browser console for errors

## 📝 Development Workflow

### Adding New Features

1. **Backend Changes**
   ```bash
   cd backend
   npm run dev  # Auto-reload on file changes
   ```

2. **Frontend Changes**
   - Edit files in `frontend/`
   - Refresh browser to see changes

3. **Database Changes**
   - Update models in `backend/src/models/`
   - Sequelize will sync on restart

### Testing
```bash
# Test API endpoints
curl http://localhost:5000/api/tasks

# Test with sample data
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Task",
    "description": "Test Description",
    "status": "pending",
    "priority": "high",
    "startDate": "2024-01-01",
    "endDate": "2024-01-10"
  }'
```

## 📦 Dependencies

### Backend
- **express** - Web framework
- **cors** - Cross-origin resource sharing
- **pg** - PostgreSQL client
- **sequelize** - ORM
- **dotenv** - Environment configuration
- **nodemon** - Development auto-reload

### Frontend
- **axios** - HTTP client
- **vanilla JavaScript** - No framework dependencies
- **Nginx** - Production web server

## 🔐 Security Notes

- ⚠️ Change `JWT_SECRET` in production
- ⚠️ Use strong database passwords
- ⚠️ Enable HTTPS in production
- ⚠️ Implement authentication/authorization
- ⚠️ Add input validation and sanitization
- ⚠️ Use environment variables for sensitive data

## 📈 Performance Considerations

- Database indexing on frequently queried columns
- Pagination for large task lists
- API response caching
- Frontend lazy loading for images
- CSS minification and optimization
- JavaScript bundling optimization

## 🎯 Future Enhancements

- [ ] User authentication & authorization
- [ ] Real-time notifications (WebSocket)
- [ ] Task templates
- [ ] Resource allocation & capacity planning
- [ ] Burndown charts
- [ ] Custom dashboards
- [ ] Export to PDF/Excel
- [ ] Mobile application
- [ ] Dark mode toggle
- [ ] Multi-language support
- [ ] Task dependencies & subtasks
- [ ] Recurring tasks
- [ ] File attachments
- [ ] Comments & discussions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 📧 Contact & Support

For issues, questions, or suggestions, please open an issue on the GitHub repository.

---

**Happy Task Tracking! 🚀**
