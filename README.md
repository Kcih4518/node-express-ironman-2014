# Todo List Application

This is a robust Todo List application built with Node.js, Express, and PostgreSQL. It provides user authentication and CRUD operations for managing todos.

## Features

- User registration and authentication
- Create, read, update, and delete todos
- Mark todos as completed
- Responsive design using Bootstrap

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14 or higher)
- Yarn (v1.22 or higher)
- PostgreSQL (v12 or higher)

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/your-username/todo-list-app.git
   cd todo-list-app
   ```

2. Install the dependencies:

   ```
   yarn install
   ```

3. Set up your environment variables:

   - Create a `.env` file in the root directory
   - Add the following variables:
     ```
     JWT_SECRET=your_jwt_secret
     PORT=3000
     DATABASE_URL=postgresql://username:password@localhost:5432/todo_db
     ```

4. Set up the database:
   - Create a PostgreSQL database named `todo_db`
   - Run the migrations:
     ```
     yarn sequelize-cli db:migrate
     ```

## Usage

To start the server:

```
yarn start
```

The application will be available at `http://localhost:3000`.

## API Endpoints

- `POST /register`: Register a new user
- `POST /login`: Authenticate a user
- `GET /todos`: Get all todos for the authenticated user
- `POST /todos`: Create a new todo
- `PUT /todos/:id`: Update a todo
- `DELETE /todos/:id`: Delete a todo

## Testing

To run the tests:

```
yarn test
```

## Contributing

Contributions to this project are welcome. Please follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b feature-branch-name`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-branch-name`
5. Create a pull request
