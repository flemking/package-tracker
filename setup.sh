#!/bin/bash

# Install Node.js (if not already installed)
if ! command -v node &> /dev/null
then
    echo "Node.js is not installed. Installing Node.js..."
    # Install Node.js (replace with the appropriate installation command for your system)
    # For example, on Ubuntu:
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install Angular CLI globally
echo "Installing Angular CLI globally..."
npm install -g @angular/cli

# Install MongoDB (if not already installed)
if ! command -v mongod &> /dev/null
then
    echo "MongoDB is not installed. Installing MongoDB..."
    # Install MongoDB (replace with the appropriate installation command for your system)
    # For example, on Ubuntu:
    sudo apt-get install -y mongodb
fi

# Navigate to the 'api' folder and install backend dependencies
echo "Installing backend dependencies..."
cd api
npm install

# Navigate to the 'client/package-tracker' folder and install frontend dependencies
echo "Installing frontend dependencies..."
cd ../client/package-tracker
npm install

# Set up environment variables
echo "Setting up environment variables..."
cd ../../api
echo "MONGODB_URI=mongodb://localhost:27017/package-tracker" > .env
echo "PORT=3000" >> .env

echo "Installation and setup complete."

echo "Starting the backend server..."
npm run start:dev &

echo "Starting the frontend development server..."
cd ../client/package-tracker
ng serve &

echo "The application should now be running at http://localhost:4200"
