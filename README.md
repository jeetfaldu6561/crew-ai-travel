**🧭 TravelGenie**

**🎯 Project Goal**

**To develop an AI-powered Travel Planning application that provides
personalized, real-time itineraries using a collaborative multi-agent AI
backend. The platform delivers travel logistics, local recommendations,
and curated plans based on user inputs --- without relying on
third-party aggregators or rigid templates.**

**🌍 Vision**

**You don\'t just plan a trip --- you plan an experience, tailored by
AI.**

**Modern travelers face fragmented information and generic travel
recommendations. TravelGenie bridges that gap with intelligent agents
that search, reason, and collaborate to generate custom travel plans
from scratch --- all while emulating human-like judgment using real-time
data.**

**🧠 Backend Architecture: AI-Powered Core**

**1. Language Model Orchestration**

- **Model: gpt-4o-mini via ChatOpenAI (LangChain)**

- **LLM Instances: Each agent has its own instance, configured with
  unique temperature settings for balance between factuality and
  creativity.**

**2. Real-Time Intelligence Tools**

- **Live Search: Integrated using GoogleSerperAPI:**

**GoogleSerperAPI(num_results=10, verbose=True)**

- **Wrapped as LangChain tools, used within CrewAI agents.**

**3. Multi-Agent System with CrewAI**

- **Framework: CrewAI**

- **Agents:**

  - **Travel Trip Expert: Focuses on accommodation, visa, costs, and
    climate.**

  - **City Local Guide Expert: Provides localized experiences, food, and
    events.**

  - **Travel Planning Expert: Synthesizes all information into a final
    itinerary.**

**4. Structured Task Assignment**

- **Defined in TravelTasks.py**

  - **location_task(), guide_task(), planner_task() → Return Task
    objects**

- **Each task is sequentially consumed in the pipeline.**

**5. Orchestration**

- **Defined via Crew object with Process.sequential**

- **Method: kickoff() starts the complete pipeline and outputs a
  Markdown (.md) itinerary**

**6. Backend API with FastAPI**

- **Implemented in main.py**

- **Endpoint: /generate-plan**

- **Accepts user input (locations, dates, interests), triggers agent
  tasks, and returns Markdown-formatted itinerary.**

**🖥️ Frontend Interface: Lightweight React App**

- **Built using React with clean layout and markdown rendering.**

- **Components:**

  - **App.jsx: Main interface**

  - **TravelAdvisor.jsx: Handles input and displays results**

- **Features:**

  - **Markdown rendering via react-markdown**

  - **PDF Export: Integrated using html2pdf.js**

  - **Responsive layout for better UX**

**🛠️ Complete Tech Stack**

![Alt Text](frontend/images/Flowchart.jpeg)

  -----------------------------------------------------------------------
  **Layer**            **Tools/Frameworks**
  -------------------- --------------------------------------------------
  **LLM**              **GPT-4o-mini via LangChain**

  **Agent Framework**  **CrewAI**

  **Web Search Tool**  **GoogleSerperAPI**

  **Task               **CrewAI Tasks & Agent orchestration**
  Coordination**       

  **Backend API**      **FastAPI**

  **Frontend UI**      **React**

  **Output Format**    **Markdown (.md), PDF export (via html2pdf.js)**
  -----------------------------------------------------------------------

# Demo Video:

Demo link: https://drive.google.com/file/d/1tTo8NUt2O8PZsqNt1YVLdtR-IdyoJ0sM/view?usp=drive_link

**🗂️ Project Structure**

**plaintext**

**CopyEdit**

**project-root/**

**├── backend/ \# FastAPI server with CrewAI and LangChain integration**

**│ ├── TravelAgents.py \# Travel, guide, and planner agents**

**│ ├── TravelTasks.py \# Task functions for each role**

**│ ├── TravelTools.py \# Google Search tool integration**

**│ ├── main.py \# FastAPI entry point**

**│ └── .env \# Contains API keys**

**│**

**├── frontend/ \# React frontend**

**│ ├── src/**

**│ │ ├── App.jsx \# Main App component**

**│ │ └── TravelAdvisor.jsx \# Core component for user input/output**

**│ └── public/**

**│**

**├── requirements.txt \# Python dependencies**

**├── README.md \# Project documentation**

**▶️ How to Run the Project Locally**

**📦 Prerequisites**

- **Node.js (v18 or higher)**

- **Python 3.9+**

- **OpenAI API Key**

- **Google Serper API Key**

**🧪 Step 1: Setup Backend (FastAPI + CrewAI)**

**bash**

**CopyEdit**

**cd backend**

**python -m venv venv**

**source venv/bin/activate \# On Windows: venv\\Scripts\\activate**

**pip install -r ../requirements.txt**

**Create a .env file with the following:**

**env**

**CopyEdit**

**OPENAI_API_KEY=your_openai_key_here**

**SERPER_API_KEY=your_serper_key_here**

**Run FastAPI backend:**

**bash**

**CopyEdit**

**uvicorn main:app \--reload**

**🌐 Step 2: Setup Frontend (React)**

**bash**

**CopyEdit**

**cd frontend**

**npm install**

**npm start**

**The React app should now be running at: <http://localhost:>5173\
It connects with the FastAPI backend at
<http://localhost:8000/generate-plan>**

**🧪 Example Input Format**

**Form Input:**

- **Cities: Paris, Rome**

- **Dates: July 1 - July 10**

- **Interests: History, Food, Nightlife**

**Output:\
A multi-day personalized itinerary with sections like:**

- **Travel Essentials**

- **Local Experiences**

- **Final Travel Plan**

**📌 Scope for Expansion**

- **🔄 Real-time Flight & Hotel APIs**

- **🌐 Multi-language Support**

- **🧳 User login & saved plans**

- **📱 Mobile-first responsive UI**
