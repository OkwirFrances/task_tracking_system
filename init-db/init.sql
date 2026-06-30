-- -- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -- CREATE TABLE IF NOT EXISTS "Tasks" (
-- --     "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
-- --     "title" VARCHAR(255) NOT NULL,
-- --     "description" TEXT,
-- --     "startDate" TIMESTAMP WITH TIME ZONE NOT NULL,
-- --     "endDate" TIMESTAMP WITH TIME ZONE NOT NULL,
-- --     "progress" INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
-- --     "status" VARCHAR(20) DEFAULT 'pending',
-- --     "priority" VARCHAR(20) DEFAULT 'medium',
-- --     "assignedTo" VARCHAR(255),
-- --     "location" VARCHAR(255),
-- --     "locationDetails" TEXT,
-- --     "dependencies" UUID[] DEFAULT ARRAY[]::UUID[],
-- --     "color" VARCHAR(7) DEFAULT '#4CAF50',
-- --     "estimatedHours" FLOAT DEFAULT 0,
-- --     "actualHours" FLOAT DEFAULT 0,
-- --     "lastProgressUpdate" TIMESTAMP WITH TIME ZONE,
-- --     "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
-- --     "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
-- -- );

-- -- CREATE TABLE IF NOT EXISTS "ProgressLogs" (
-- --     "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
-- --     "taskId" UUID NOT NULL REFERENCES "Tasks"("id") ON DELETE CASCADE,
-- --     "userId" VARCHAR(255),
-- --     "userName" VARCHAR(255),
-- --     "action" VARCHAR(50) NOT NULL,
-- --     "description" TEXT NOT NULL,
-- --     "location" VARCHAR(255),
-- --     "locationDetails" TEXT,
-- --     "progressValue" INTEGER CHECK (progressValue >= 0 AND progressValue <= 100),
-- --     "hoursSpent" FLOAT DEFAULT 0,
-- --     "notes" TEXT,
-- --     "attachments" TEXT[],
-- --     "ipAddress" VARCHAR(45),
-- --     "userAgent" TEXT,
-- --     "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
-- --     "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
-- -- );

-- -- CREATE INDEX IF NOT EXISTS idx_tasks_status ON "Tasks"("status");
-- -- CREATE INDEX IF NOT EXISTS idx_tasks_priority ON "Tasks"("priority");
-- -- CREATE INDEX IF NOT EXISTS idx_tasks_start_date ON "Tasks"("startDate");
-- -- CREATE INDEX IF NOT EXISTS idx_tasks_end_date ON "Tasks"("endDate");
-- -- CREATE INDEX IF NOT EXISTS idx_tasks_location ON "Tasks"("location");
-- -- CREATE INDEX IF NOT EXISTS idx_progress_logs_task_id ON "ProgressLogs"("taskId");
-- -- CREATE INDEX IF NOT EXISTS idx_progress_logs_created_at ON "ProgressLogs"("createdAt");
-- -- init-db/init.sql
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CREATE TABLE IF NOT EXISTS "Tasks" (
--     "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     "title" VARCHAR(255) NOT NULL,
--     "description" TEXT,
--     "startDate" TIMESTAMP WITH TIME ZONE NOT NULL,
--     "endDate" TIMESTAMP WITH TIME ZONE NOT NULL,
--     "progress" INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
--     "status" VARCHAR(20) DEFAULT 'pending',
--     "priority" VARCHAR(20) DEFAULT 'medium',
--     "assignedTo" VARCHAR(255),
--     "location" VARCHAR(255),
--     "locationDetails" TEXT,
--     "dependencies" UUID[] DEFAULT ARRAY[]::UUID[],
--     "color" VARCHAR(7) DEFAULT '#4CAF50',
--     "estimatedHours" FLOAT DEFAULT 0,
--     "actualHours" FLOAT DEFAULT 0,
--     "lastProgressUpdate" TIMESTAMP WITH TIME ZONE,
--     "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
--     "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
-- );

-- CREATE TABLE IF NOT EXISTS "ProgressLogs" (
--     "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     "taskId" UUID NOT NULL REFERENCES "Tasks"("id") ON DELETE CASCADE,
--     "userId" VARCHAR(255),
--     "userName" VARCHAR(255),
--     "action" VARCHAR(50) NOT NULL,
--     "description" TEXT NOT NULL,
--     "location" VARCHAR(255),
--     "locationDetails" TEXT,
--     "progressValue" INTEGER CHECK (progressValue >= 0 AND progressValue <= 100),
--     "hoursSpent" FLOAT DEFAULT 0,
--     "notes" TEXT,
--     "attachments" TEXT[],
--     "ipAddress" VARCHAR(45),
--     "userAgent" TEXT,
--     "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
--     "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
-- );

-- CREATE INDEX IF NOT EXISTS idx_tasks_status ON "Tasks"("status");
-- CREATE INDEX IF NOT EXISTS idx_tasks_priority ON "Tasks"("priority");
-- CREATE INDEX IF NOT EXISTS idx_tasks_start_date ON "Tasks"("startDate");
-- CREATE INDEX IF NOT EXISTS idx_tasks_end_date ON "Tasks"("endDate");
-- CREATE INDEX IF NOT EXISTS idx_tasks_location ON "Tasks"("location");
-- CREATE INDEX IF NOT EXISTS idx_progress_logs_task_id ON "ProgressLogs"("taskId");
-- CREATE INDEX IF NOT EXISTS idx_progress_logs_created_at ON "ProgressLogs"("createdAt");

-- -- Insert sample data
-- INSERT INTO "Tasks" ("id", "title", "description", "startDate", "endDate", "progress", "status", "priority", "assignedTo", "location", "locationDetails", "estimatedHours", "createdAt", "updatedAt")
-- VALUES 
--     (gen_random_uuid(), 'Project Kickoff', 'Initial project planning and team alignment', 
--      NOW() - INTERVAL '10 days', NOW() + INTERVAL '5 days', 100, 'completed', 'high', 'John Doe', 'Office', 'Conference Room A', 8, NOW(), NOW()),
--     (gen_random_uuid(), 'UI/UX Design', 'Design user interfaces and experience flows', 
--      NOW() - INTERVAL '7 days', NOW() + INTERVAL '12 days', 75, 'in-progress', 'high', 'Jane Smith', 'Remote', 'Figma', 40, NOW(), NOW()),
--     (gen_random_uuid(), 'Backend API Development', 'Develop RESTful APIs and database models', 
--      NOW() - INTERVAL '3 days', NOW() + INTERVAL '18 days', 30, 'in-progress', 'critical', 'Mike Johnson', 'Home Office', 'VS Code', 60, NOW(), NOW()),
--     (gen_random_uuid(), 'Frontend Implementation', 'Build responsive UI components', 
--      NOW() + INTERVAL '2 days', NOW() + INTERVAL '20 days', 0, 'pending', 'high', 'Sarah Wilson', 'Office', 'Workstation 5', 50, NOW(), NOW()),
--     (gen_random_uuid(), 'Testing and QA', 'Comprehensive testing and quality assurance', 
--      NOW() + INTERVAL '15 days', NOW() + INTERVAL '25 days', 0, 'pending', 'medium', 'Robert Brown', 'Client Site', 'QA Lab', 30, NOW(), NOW());

-- -- Insert sample progress logs
-- INSERT INTO "ProgressLogs" ("taskId", "userName", "action", "description", "location", "progressValue", "hoursSpent", "createdAt", "updatedAt")
-- SELECT 
--     "id",
--     'John Doe',
--     'progress-update',
--     'Completed project planning and scope definition',
--     'Office',
--     100,
--     4,
--     NOW() - INTERVAL '2 days',
--     NOW() - INTERVAL '2 days'
-- FROM "Tasks" 
-- WHERE "title" = 'Project Kickoff'
-- LIMIT 1;

-- INSERT INTO "ProgressLogs" ("taskId", "userName", "action", "description", "location", "progressValue", "hoursSpent", "createdAt", "updatedAt")
-- SELECT 
--     "id",
--     'Jane Smith',
--     'progress-update',
--     'Completed wireframes and started high-fidelity mockups',
--     'Remote',
--     75,
--     6,
--     NOW() - INTERVAL '1 day',
--     NOW() - INTERVAL '1 day'
-- FROM "Tasks" 
-- WHERE "title" = 'UI/UX Design'
-- LIMIT 1;
-- init-db/init.sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Tasks table
CREATE TABLE IF NOT EXISTS "Tasks" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP WITH TIME ZONE NOT NULL,
    "endDate" TIMESTAMP WITH TIME ZONE NOT NULL,
    "progress" INTEGER DEFAULT 0,
    "status" VARCHAR(20) DEFAULT 'pending',
    "priority" VARCHAR(20) DEFAULT 'medium',
    "assignedTo" VARCHAR(255),
    "location" VARCHAR(255),
    "locationDetails" TEXT,
    "dependencies" UUID[] DEFAULT ARRAY[]::UUID[],
    "color" VARCHAR(7) DEFAULT '#4CAF50',
    "estimatedHours" FLOAT DEFAULT 0,
    "actualHours" FLOAT DEFAULT 0,
    "lastProgressUpdate" TIMESTAMP WITH TIME ZONE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create ProgressLogs table (without CHECK constraint)
CREATE TABLE IF NOT EXISTS "ProgressLogs" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "taskId" UUID NOT NULL REFERENCES "Tasks"("id") ON DELETE CASCADE,
    "userId" VARCHAR(255),
    "userName" VARCHAR(255),
    "action" VARCHAR(50) NOT NULL,
    "description" TEXT NOT NULL,
    "location" VARCHAR(255),
    "locationDetails" TEXT,
    "progressValue" INTEGER,
    "hoursSpent" FLOAT DEFAULT 0,
    "notes" TEXT,
    "attachments" TEXT[],
    "ipAddress" VARCHAR(45),
    "userAgent" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_tasks_status ON "Tasks"("status");
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON "Tasks"("priority");
CREATE INDEX IF NOT EXISTS idx_tasks_start_date ON "Tasks"("startDate");
CREATE INDEX IF NOT EXISTS idx_tasks_end_date ON "Tasks"("endDate");
CREATE INDEX IF NOT EXISTS idx_tasks_location ON "Tasks"("location");
CREATE INDEX IF NOT EXISTS idx_progress_logs_task_id ON "ProgressLogs"("taskId");
CREATE INDEX IF NOT EXISTS idx_progress_logs_created_at ON "ProgressLogs"("createdAt");

-- Insert sample data (only if tables are empty)
INSERT INTO "Tasks" ("id", "title", "description", "startDate", "endDate", "progress", "status", "priority", "assignedTo", "location", "locationDetails", "estimatedHours", "createdAt", "updatedAt")
SELECT 
    gen_random_uuid(), 'Project Kickoff', 'Initial project planning and team alignment', 
    NOW() - INTERVAL '10 days', NOW() + INTERVAL '5 days', 100, 'completed', 'high', 'John Doe', 'Office', 'Conference Room A', 8, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM "Tasks" LIMIT 1);

INSERT INTO "Tasks" ("id", "title", "description", "startDate", "endDate", "progress", "status", "priority", "assignedTo", "location", "locationDetails", "estimatedHours", "createdAt", "updatedAt")
SELECT 
    gen_random_uuid(), 'UI/UX Design', 'Design user interfaces and experience flows', 
    NOW() - INTERVAL '7 days', NOW() + INTERVAL '12 days', 75, 'in-progress', 'high', 'Jane Smith', 'Remote', 'Figma', 40, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM "Tasks" WHERE "title" = 'UI/UX Design');

INSERT INTO "Tasks" ("id", "title", "description", "startDate", "endDate", "progress", "status", "priority", "assignedTo", "location", "locationDetails", "estimatedHours", "createdAt", "updatedAt")
SELECT 
    gen_random_uuid(), 'Backend API Development', 'Develop RESTful APIs and database models', 
    NOW() - INTERVAL '3 days', NOW() + INTERVAL '18 days', 30, 'in-progress', 'critical', 'Mike Johnson', 'Home Office', 'VS Code', 60, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM "Tasks" WHERE "title" = 'Backend API Development');

INSERT INTO "Tasks" ("id", "title", "description", "startDate", "endDate", "progress", "status", "priority", "assignedTo", "location", "locationDetails", "estimatedHours", "createdAt", "updatedAt")
SELECT 
    gen_random_uuid(), 'Frontend Implementation', 'Build responsive UI components', 
    NOW() + INTERVAL '2 days', NOW() + INTERVAL '20 days', 0, 'pending', 'high', 'Sarah Wilson', 'Office', 'Workstation 5', 50, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM "Tasks" WHERE "title" = 'Frontend Implementation');

INSERT INTO "Tasks" ("id", "title", "description", "startDate", "endDate", "progress", "status", "priority", "assignedTo", "location", "locationDetails", "estimatedHours", "createdAt", "updatedAt")
SELECT 
    gen_random_uuid(), 'Testing and QA', 'Comprehensive testing and quality assurance', 
    NOW() + INTERVAL '15 days', NOW() + INTERVAL '25 days', 0, 'pending', 'medium', 'Robert Brown', 'Client Site', 'QA Lab', 30, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM "Tasks" WHERE "title" = 'Testing and QA');