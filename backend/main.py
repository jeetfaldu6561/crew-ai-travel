from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware  # Import CORS middleware
from pydantic import BaseModel
from TravelAgents import guide_expert, location_expert, planner_expert
from TravelTasks import location_task, guide_task, planner_task
from crewai import Crew, Process

app = FastAPI()

# Enable CORS for frontend (React) running on localhost:5173
origins = [
    "http://localhost:5173",  # Allow React frontend's URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows requests from this origin
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Mount the static folder to serve static files like favicon
app.mount("/static", StaticFiles(directory="static"), name="static")

# Route for the root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to the Travel Advisor API!"}

# Route to handle favicon requests (Optional)
@app.get("/favicon.ico")
async def favicon():
    return {"message": "No favicon available"}

# Pydantic model for the data you're expecting from the frontend
class TravelRequest(BaseModel):
    from_city: str
    destination_city: str
    date_from: str
    date_to: str
    interests: str

# Route for generating the travel plan using Crew AI
@app.post("/generate-plan")
async def generate_plan(data: TravelRequest):
    # Validate and get user data from the request
    from_city = data.from_city
    destination_city = data.destination_city
    date_from = data.date_from
    date_to = data.date_to
    interests = data.interests

    # Initialize tasks for location, guide, and planner
    loc_task = location_task(location_expert, from_city, destination_city, date_from, date_to)
    guid_task = guide_task(guide_expert, destination_city, interests, date_from, date_to)
    plan_task = planner_task([loc_task, guid_task], planner_expert, destination_city, interests, date_from, date_to)

    # Define the Crew AI process
    crew = Crew(
        agents=[location_expert, guide_expert, planner_expert],
        tasks=[loc_task, guid_task, plan_task],
        process=Process.sequential,
        full_output=True,
        verbose=True,
    )

    # Run Crew AI to generate the travel plan
    result = crew.kickoff()

    # Return the AI-generated travel plan as a response
    return {"travel_plan": result}
