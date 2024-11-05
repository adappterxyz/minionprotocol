#!/bin/bash
# Ensure the script exits on first error
#set -e

# Optionally, you can include the playwright installation if it's not part of the Dockerfile
# npx playwright install

# Start your application#
npm start

# Wait for the application to be up if necessary
# sleep 10

# Run Playwright tests
npx playwright test

# Serve the test report
npx playwright show-report html-report --host 0.0.0.0