const express = require('express');
const cors = require('cors');
const morgan = require('morgan'); // for logging
const { createLogger, format, transports } = require('winston');

// Initialize Express app
const app = express();
const router = express.Router();

// Initialize logger
const logger = createLogger({
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'playwright-service.log' })
    ]
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for large scripts
app.use(morgan('dev')); // HTTP request logging

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error('Unhandled error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Import controllers
const { triggerJob, addJob, scheduleJob, listJobs, deleteJob } = require('./controllers/jobController');

// API Routes
router.post('/trigger', async (req, res) => {
    try {
        logger.info('Triggering job', { jobName: req.body.jobName });
        const result = await triggerJob(req, res);
        logger.info('Job triggered successfully', { jobName: req.body.jobName, result });
    } catch (error) {
        logger.error('Error triggering job', { 
            jobName: req.body.jobName, 
            error: error.message 
        });
        res.status(500).json({ error: error.message });
    }
});

router.post('/add', async (req, res) => {
    try {
        logger.info('Adding new job', { jobName: req.body.jobName });
        
        // Validate required fields
        const { jobName, requiredArguments, script } = req.body;
        if (!jobName || !script) {
            throw new Error('jobName and script are required');
        }

        const result = await addJob(req, res);
        logger.info('Job added successfully', { jobName: req.body.jobName });
    } catch (error) {
        logger.error('Error adding job', { 
            jobName: req.body.jobName, 
            error: error.message 
        });
        res.status(400).json({ error: error.message });
    }
});

router.post('/schedule', async (req, res) => {
    try {
        logger.info('Scheduling job', { 
            jobName: req.body.jobName,
            cronExpression: req.body.cronExpression 
        });
        
        // Validate cron expression
        const { jobName, cronExpression } = req.body;
        if (!jobName || !cronExpression) {
            throw new Error('jobName and cronExpression are required');
        }

        const result = await scheduleJob(req, res);
        logger.info('Job scheduled successfully', { 
            jobName: req.body.jobName,
            nextInvocation: result.nextInvocation 
        });
    } catch (error) {
        logger.error('Error scheduling job', { 
            jobName: req.body.jobName, 
            error: error.message 
        });
        res.status(400).json({ error: error.message });
    }
});

// Additional useful endpoints
router.get('/jobs', async (req, res) => {
    try {
        const jobs = await listJobs();
        res.json(jobs);
    } catch (error) {
        logger.error('Error listing jobs', { error: error.message });
        res.status(500).json({ error: error.message });
    }
});

router.delete('/jobs/:jobName', async (req, res) => {
    try {
        const { jobName } = req.params;
        await deleteJob(jobName);
        logger.info('Job deleted successfully', { jobName });
        res.json({ status: 'success', message: `Job ${jobName} deleted` });
    } catch (error) {
        logger.error('Error deleting job', { 
            jobName: req.params.jobName, 
            error: error.message 
        });
        res.status(400).json({ error: error.message });
    }
});

// Mount router
app.use('/api/playwright', router);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger.info(`Playwright service running on port ${PORT}`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (error) => {
    logger.error('Unhandled Rejection:', error);
    process.exit(1);
});

module.exports = app;