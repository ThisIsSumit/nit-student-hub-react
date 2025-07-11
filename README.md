
# NIT Hamirpur Student Hub

Welcome to the **NIT Hamirpur Student Hub**, a full-stack web application designed to connect students at NIT Hamirpur for collaboration, learning, and community building. This app provides features like Roommate Finder, Study Group Formation, Hackathon Team Builder, real-time Chat, and Idea Sharing, enhanced with a modern UI/UX using Three.js for 3D visuals and GSAP for animations.

- **Live Demo**: [Not deployed yet - see local setup instructions](#setup)

## Features
- **User Authentication**: Secure login and registration with JWT.
- **Roommate Finder**: Match students based on hostel, budget, and habits.
- **Study Group Formation**: Connect students by course, semester, and study style.
- **Hackathon Team Builder**: Find teammates based on tech stack, roll number, hostel, languages, habits, and more.
- **Real-Time Chat**: Communicate instantly with peers using WebSocket.
- **Idea Sharing**: Share and upvote innovative ideas.
- **Modern UI/UX**: 3D campus model with Three.js, smooth animations with GSAP, and a blue-yellow gradient theme.

## Tech Stack
- **Frontend**: React (Vite), Three.js, GSAP, Tailwind CSS, React Router
- **Backend**: Spring Boot, Spring WebSocket, Spring Security, JPA/Hibernate
- **Database**: PostgreSQL
- **Real-Time**: WebSocket with STOMP
- **Authentication**: JWT

## Prerequisites
- **Node.js** (v18+)
- **Java JDK** (17+)
- **PostgreSQL** (with a database named `nit_student_hub`)
- **npm** or **yarn**
- **Maven** (for backend)

## Setup

### 1. Clone the Repository
```bash
git clone https://github.com/ThisIsSumit/nit-student-hub-react.git
cd nit-student-hub
```

### 2. Backend Setup
- **Navigate to Backend**:
  ```bash
  cd backend
  ```
- **Configure Database**:
  - Update `src/main/resources/application.properties` with your PostgreSQL credentials:
    ```properties
    spring.datasource.url=jdbc:postgresql://localhost:5432/nit_student_hub
    spring.datasource.username=postgres
    spring.datasource.password=your_password
    ```
- **Install Dependencies and Run**:
  ```bash
  ./mvnw spring-boot:run
  ```
  The backend will run on `http://localhost:8080`.

### 3. Frontend Setup
- **Navigate to Frontend**:
  ```bash
  cd ../frontend
  ```
- **Install Dependencies**:
  ```bash
  npm install
  ```
- **Run the Application**:
  ```bash
  npm run dev
  ```
  The frontend will be available at `http://localhost:5173`.

### 4. Environment Variables
- Ensure the backend and frontend can communicate (e.g., CORS settings in Spring Boot if needed).

## Usage
1. **Register**: Create an account with your roll number, username, and profile details.
2. **Login**: Access the app with your credentials.
3. **Explore Features**: Use the navigation bar to access Roommate Finder, Study Group Formation, Hackathon Team Builder, Chat, and Idea Sharing.
4. **Interact**: Submit forms to find matches, send messages, or share ideas.


### Notes
- **Customization**: Replace `your-username`, `your_password`, and `your-email@example.com` with appropriate values.
- **Deployment Link**: Update the live demo link once deployed (e.g., to Heroku or Netlify).
- **License**: Add a `LICENSE` file with MIT License text if not already included.
- **Images**: Ensure icons (e.g., `home-icon.svg`) are created and placed in `frontend/src/assets/` as described in previous prompts.

Save this as `README.md` in the root of your GitHub repository. Let me know if you need further adjustments!
