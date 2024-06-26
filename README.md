# Next.js Task Manager 📝

A simple, intuitive task management application built with Next.js. This project demonstrates practical use of CRUD operations, custom alerts for user interactions, debounced API calls to improve performance, and rate limiting for enhanced security.

You can see the Project here : https://task-manager-mauve-delta.vercel.app/

## Features ✨

- **CRUD Operations**: Users can create, read, update, and delete tasks, each represented with a title, description, and status.
- **Custom Alerts**: Provides immediate, styled feedback sliding in from the left for create, update, and delete actions, enhancing the user experience.
- **Debounced API Calls**: Debounce pattern applied on task updates to minimize unnecessary server requests, improving the app's performance.
- **Rate Limiting**: Protects the API from excessive usage, ensuring the app's availability and reliability.
- **Responsive Design**: Aesthetically pleasing and functional on both desktop and mobile devices.

## Getting Started 🚀

### Prerequisites

- Node.js (LTS version recommended)
- npm or Yarn

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/Shreyaanp/task-manager.git
cd nextjs-task-manager

```
2. **Create a .env**
   ```bash
   create a file called .env in the root of the project
   then add your MongoDN URI like this :
   MONGODB_URI= your_MongoDB_URI
   ```
3. **Install Necessary packages**

   ```bash
    npm install
    # or
    yarn install
   ```
4. **To Run the application Locally**

   ```bash
    npm run dev
    # or
    yarn dev
   ```
Open http://localhost:3000 with your browser to see the result.

## Folder Structure 📁
- components/: Reusable UI components like TaskForm, TaskList and Alert.
- lib/: Utility functions and library integrations, including MongoDB connections.
- pages/: Next.js pages and API routes. It includes the main page and the API logic for task operations.
- styles/: Global styles and CSS/SCSS modules for styling components.
- utils/: Helper functions and custom utilities, including the debounce function and rate limiter setup.

## PostMan Curl Test for Backend Api :
- Create a New task
```bash
curl -X POST http://localhost:3000/api/tasks \
-H 'Content-Type: application/json' \
-d '{
    "title": "Learn Node.js",
    "description": "Start with the basics of Node.js",
    "status": "To Do"
}'

```
- Retrieve All tasks
```bash
curl -X GET http://localhost:3000/api/tasks
```
- Update an existing task(you have add the task ID)
```bash
curl -X PUT http://localhost:3000/api/tasks/<TASK_ID> \
-H 'Content-Type: application/json' \
-d '{
    "title": "Learn Node.js (Updated)",
    "description": "Learn advanced Node.js concepts",
    "status": "In Progress"
}'
```
- Remove a task(you have add the task ID)
```bash
curl -X DELETE http://localhost:3000/api/tasks/<TASK_ID>
```

### Key Concepts Explained
## Debouncing
Debouncing is a programming practice used to ensure that time-consuming tasks do not fire so often, which can hurt performance, especially in cases like server calls. In this application, debouncing is applied to task updates, which means that if a user rapidly changes a task's status, it will not send a request to the server on each change. Instead, it waits until the user has stopped making changes for a specific amount of time before making a single request. This is particularly useful for tasks like search or in this case, updating tasks, where you don't want to overload the server with requests.

## Rate Limiting
Rate limiting is used to control the amount of incoming requests to a server within a certain timeframe. This is crucial for preventing abuse and ensuring the service remains available to all users. In the Next.js Task Manager, rate limiting is applied to the API routes to prevent excessive requests that could lead to Denial of Service (DoS) attacks or degrade the application's performance. It's implemented using the rate-limiter-flexible package, ensuring that users can't make more than a specified number of requests to the API within a given period.

## Testing API 
```bash 
npm test
```
run the above code to test check the api. you need to enter your MongoURI here manually.
![Screenshot from 202sdfsdf4-03-30 12-23-28](https://github.com/Shreyaanp/task-manager/assets/79451850/c72a9036-edcf-4dcd-ba41-24f95827e097)



## Contributing 🤝
Contributions, issues, and feature requests are welcome! Feel free to check issues page. For major changes, please open an issue first to discuss what you would like to change.


