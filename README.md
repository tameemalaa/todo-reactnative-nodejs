# todo-reactnative-nodejs
A Simple todo app with react native and nodejs

## Front-end

The front-end application is built using React Native


### Getting Started

1. Clone the repository:

```bash
git clone https://github.com/tameemalaa/todo-reactnative-nodejs.git
```

2. Install dependencies:

```bash
cd todo-reactnative-nodejs/client
npm install
```

3. Start the development server:

```bash
npm start
```

4. Follow the instructions in the console to launch the application on your mobile device or emulator.

5. The front-end application is now running and connected to the back-end server.

### Project Structure

- `/client` - Contains the application source code.
- `/client/screens` - Contains the different screens of the application.

## Back-end

The back-end server is built using Node.js and utilizes PostgreSQL as the database management system from Prisma ORM.
### Getting Started

1. Clone the repository:

```bash
git clone https://github.com/tameemalaa/todo-reactnative-nodejs.git
```

2. Install dependencies:

```bash
cd todo-reactnative-nodejs/server
npm install
```
3.Run database migrations:
```bash
cd todo-reactnative-nodejs/server/prisma
npx prisma migrate dev
```

4. Start the development server:

```bash
npm run devstart
```
### Project Structure

- `server/src` - Contains the server source code.
- `server/src/routes` - Contains the API routes.
- `server/src/controllers` - Contains the request handlers.
- `server/src/prisma` - Contains the database schema.
- `server/src/middlewares` - Contains the request interceptors.
- `server/src/services` - Contains the necessary services.

## License

[MIT License](LICENSE)