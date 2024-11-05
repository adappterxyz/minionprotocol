const { scheduleJob: nodeScheduleJob } = require('node-schedule');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const jobStore = new Map(); // In-memory store for jobs
const SCRIPTS_DIR = path.join(__dirname, '../scripts');

// Ensure scripts directory exists
if (!fs.existsSync(SCRIPTS_DIR)) {
    fs.mkdirSync(SCRIPTS_DIR, { recursive: true });
}

const triggerJob = async (req, res) => {
    try {
        const { jobName, arguments } = req.body;
        
        if (!jobStore.has(jobName)) {
            return res.status(404).json({ error: 'Job not found' });
        }

        const job = jobStore.get(jobName);
        const scriptPath = path.join(SCRIPTS_DIR, `${jobName}.spec.ts`);

        // Execute the Playwright test with arguments
        const result = await executePlaywrightTest(scriptPath, arguments);
        
        res.json({ 
            status: 'success', 
            jobName,
            result 
        });
    } catch (error) {
        res.status(500).json({ 
            error: error.message 
        });
    }
};

const addJob = async (req, res) => {
    try {
        const { jobName, requiredArguments, script } = req.body;

        if (jobStore.has(jobName)) {
            return res.status(400).json({ error: 'Job already exists' });
        }

        // Save script to file
        const scriptPath = path.join(SCRIPTS_DIR, `${jobName}.spec.ts`);
        fs.writeFileSync(scriptPath, script);

        // Store job metadata
        jobStore.set(jobName, {
            requiredArguments,
            scriptPath,
            created: new Date(),
        });

        res.json({ 
            status: 'success', 
            jobName,
            requiredArguments 
        });
    } catch (error) {
        res.status(500).json({ 
            error: error.message 
        });
    }
};

const schedulePlaywrightJob = async (req, res) => {
    try {
        const { jobName, cronExpression, arguments } = req.body;

        if (!jobStore.has(jobName)) {
            return res.status(404).json({ error: 'Job not found' });
        }

        const scheduledJob = nodeScheduleJob(cronExpression, async () => {
            const scriptPath = path.join(SCRIPTS_DIR, `${jobName}.spec.ts`);
            await executePlaywrightTest(scriptPath, arguments);
        });

        res.json({ 
            status: 'success', 
            jobName,
            nextInvocation: scheduledJob.nextInvocation() 
        });
    } catch (error) {
        res.status(500).json({ 
            error: error.message 
        });
    }
};

async function executePlaywrightTest(scriptPath, args = {}) {
    try {
        // Convert arguments to environment variables
        const env = {
            ...process.env,
            ...Object.entries(args).reduce((acc, [key, value]) => {
                acc[`TEST_ARG_${key.toUpperCase()}`] = value;
                return acc;
            }, {})
        };

        const result = execSync(`npx playwright test ${scriptPath}`, {
            stdio: 'pipe',
            env,
            encoding: 'utf-8'
        });

        return { success: true, output: result };
    } catch (error) {
        throw new Error(`Test execution failed: ${error.message}`);
    }
}

module.exports = {
    triggerJob,
    addJob,
    schedulePlaywrightJob
};