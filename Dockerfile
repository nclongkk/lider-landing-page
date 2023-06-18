# Use an official Node.js runtime as the base image
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock to the working directory
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the entire app directory to the working directory
COPY . .

# Build the Next.js app for production
RUN yarn build

# Set the environment variable to production
ENV NODE_ENV=production

# Expose the port that the Next.js app listens on
EXPOSE 3001

# Start the Next.js app
CMD ["yarn", "start"]