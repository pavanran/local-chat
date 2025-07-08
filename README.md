# Local Chat Application

This repository contains a simple real-time web chat application built using Node.js, Express, and Socket.IO. The application allows users to exchange messages and upload files through a browser interface. Each connected user is visually identified with a unique color.

## Features

The application provides real-time communication using WebSockets. Users can send and receive text messages and upload files. Each user is assigned a unique color for message identification. The client interface includes support for formatted code blocks, file links, scroll behavior, and dynamic user count display.

## Requirements

To run this project locally, the following software is required:

- Node.js (version 14 or higher recommended)
- npm (Node Package Manager)

## Installation

1. Clone the repository to your local machine.

2. Navigate to the project directory.

3. Install the dependencies using npm:

npm install

bash
Always show details

Copy

## Usage

To start the server, run the following command:

node server.js

pgsql
Always show details

Copy

By default, the server will listen on port 3005. You can access the chat interface by visiting `http://localhost:3005` in your browser.

## Project Structure

- `server.js`: Main server-side application using Express and Socket.IO.
- `public/index.html`: Client-side HTML, CSS, and JavaScript.
- `.gitignore`: Specifies files and directories to be excluded from version control.
- `package.json` and `package-lock.json`: Project metadata and dependencies.

## Notes

This project is intended for local use or experimentation. It does not include persistent storage, user authentication, or production-level deployment configuration.

## License

This project is licensed under the ISC License.
