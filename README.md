# Agile Assessment UI  

This repository contains the frontend for the Agile Assessment project, built using **React** and **Vite**. The project offers a fast development environment and optimized production builds.  

---

## Installation  

### Prerequisites  
Before you begin, ensure you have the following installed:  
1. **Node.js** (v22.13.0)  
   - Download and install from [Node.js](https://nodejs.org/).  
2. **npm** (v10.9.2)  
   - Verify installation with:  
     ```bash
     node -v
     npm -v
     ```  
   - If `npm` is not at version 10.9.2, update it using:  
     ```bash
     npm install -g npm@10.9.2
     ```  
3. **Git**  
   - Download and install from [Git](https://git-scm.com/downloads).  

---

### Setting Up the Environment  

1. **Clone the Repository**:  
   Clone the project from GitLab:  
   ```bash
   git clone https://gitsource.axonactive.com/agile-tools/agile-assessment/agile-assessment-ui.git
   cd agile-assessment-ui
2. **Create a .env File:**
   Copy the structure from the .env.template file included in the project:
   ```bash
   VITE_NET_API_BASE_URL=YOUR_NET_URL
   VITE_JAVA_API_BASE_URL=YOUR_JAVA_URL
   VITE_AUTHEN_API_BASE_URL=YOUR_AUTHEN_URL
   ```
   
   Replace YOUR_NET_URL, YOUR_JAVA_URL and YOUR_AUTHEN_URL with the actual server URLs. Example:
   ```bash
   VITE_NET_API_BASE_URL='http://localhost:8080/api' 
   VITE_JAVA_API_BASE_URL='http://localhost:8080/agile-assessment/api'
   VITE_JAVA_API_BASE_URL='http://localhost:8080/agile-authentication/api'
3. **Install Dependencies:**
    ```bash
    npm install
4. **Running the Application**:
    ```bash
    npm run dev
    
### Storybook

You can view the Storybook at [http://localhost:3000/storybook](http://localhost:3000/storybook) once the application is running.
