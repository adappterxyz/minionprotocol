# Use the official Playwright image with Node.js included
FROM mcr.microsoft.com/playwright:latest
# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# If npm start is used for initial setup, make sure it's designed to exit
#RUN npm start

# Install necessary components for Playwright
RUN npx playwright install

# Run Playwright tests
#RUN npx playwright test

# Set the entry point for the container to serve the test report
#CMD ["npm", "start", "npx","playwright","install","npx","playwright","test", "playwright", "show-report", "--host", "0.0.0.0"]

RUN chmod +x /app/entrypoint.sh

# Set the script as the entry point
ENTRYPOINT ["/app/entrypoint.sh"]