# Use the official Node.js image as a base image
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy necessary files to the container
COPY .next/standalone .
COPY .next/static ./.next/static
COPY ./public ./public

# Expose the port the app runs on
EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=production
ENV HOSTNAME='0.0.0.0'

USER node


# Start the app
CMD ["/bin/sh", "-c", "HOSTNAME='0.0.0.0' node server.js"]