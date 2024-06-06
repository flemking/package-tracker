# Package Tracking System

The Package Tracking System is a web application that allows users to track the status and location of their packages during shipment. It consists of an Angular frontend and a Node.js backend with a MongoDB database.

## Prerequisites

- Node.js (version 12 or higher)
- Angular CLI (version 11 or higher)
- MongoDB (version 4 or higher)

## Installation

1. Clone the repository: `git clone https://github.com/your-repo/package-tracking-system.git`
2. Navigate to the project directory: `cd package-tracking-system`
3. Run the setup script: `bash setup.sh`

The setup script will install all necessary dependencies, set up the environment variables, and provide instructions for starting the backend server and frontend development server.

## Running the Application

1. Start the backend server: `npm run start:dev` (in the `api` folder)
2. Start the frontend development server: `ng serve` (in the `client/package-tracker` folder)
3. Open your browser and navigate to `http://localhost:4200` to access the application.

## Project Structure

- `api`: Contains the backend code and configuration files.
- `client/package-tracker`: Contains the Angular frontend application.
- `README.md`: This file, providing an overview and instructions for the project.
- `setup.sh`: A script to automate the installation and setup process.

## API Documentation

The backend API is documented using Swagger. You can access the Swagger documentation by navigating to `http://localhost:3000/api-docs` after starting the backend server.

## Testing

### Backend Tests

1. Navigate to the `api` folder: `cd api`
2. Run the tests: `npm test`

## Contributing

If you would like to contribute to this project, please follow the guidelines in the `CONTRIBUTING.md` file.

## License

This project is licensed under the [MIT License](LICENSE).
