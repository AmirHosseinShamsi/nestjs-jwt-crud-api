# 🐈 NestJS Project

Welcome to the NestJS Crud application! 
This is a backend project built with NestJS and connected to PostgreSQL with JWT authentication. 
Follow the instructions below to get started.

## 🚀 Getting Started

To get started with the project, follow these steps:

### 1. Clone the Repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/AmirHosseinShamsi/nestjs-jwt-crud-api.git
cd your-project-name
```

## Install Dependencies
Run the following command to install the project dependencies:
```bash
npm install
```

## Set Up PostgreSQL
Make sure you have PostgreSQL installed and running on your local machine.
If you don’t have it yet, follow the [official installation guide](https://www.postgresql.org/download/).

## Set Up Environment Variables
Create a .env file in the root of your project by copying the provided .env.example file:
```bash
cp .env.example .env
```

Now, open the .env file and set the following variables:

- DB_HOST: Your PostgreSQL database IP address
- DB_PORT: The port your PostgreSQL database is running on (default: 5432)
- DB_USERNAME: Your PostgreSQL username
- DB_PASSWORD: Your PostgreSQL password
- DB_NAME: The name of your PostgreSQL database
- JWT_SECRET: Your secret key for JWT authentication (you can generate one or use a random string)

## Running the Project
Once you’ve set up your .env file and installed the dependencies, you can run the project:
```bash
npm run start
```
This will start the server, and you can now access the API at http://localhost:3000.

## 💡 Contributing
We welcome contributions! If you want to improve this project, feel free to fork it, make your changes, and create a pull request.

Don't forget to star the project if you find it useful!

Feel free to open an issue or reach out if you have any questions or suggestions!

Happy coding! 👨‍💻👩‍💻