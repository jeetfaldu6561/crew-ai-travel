from crewai import Agent
from TravelTools import search_web_tool
from crewai import LLM
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
load_dotenv()

# Initialize LLM
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.3)


# Agents
guide_expert = Agent(
    role="City Local Guide Expert",
    goal="Provides information on things to do in the city based on user interests.",
    backstory="A local expert passionate about sharing city experiences.",
    tools=[search_web_tool],
    verbose=True,
    max_iter=5,
    llm=ChatOpenAI(model="gpt-4o-mini", temperature=0.8),
    allow_delegation=False,
)

location_expert = Agent(
    role="Travel Trip Expert",
    goal="Provides travel logistics and essential information.",
    backstory="A seasoned traveler who knows everything about different cities.",
    tools=[search_web_tool],  
    verbose=True,
    max_iter=5,
    llm= ChatOpenAI(model="gpt-4o-mini", temperature=0.4),
    allow_delegation=False,
)

planner_expert = Agent(
    role="Travel Planning Expert",
    goal="Compiles all gathered information to create a travel plan.",
    backstory="An expert in planning seamless travel itineraries.",
    tools=[search_web_tool],
    verbose=True,
    max_iter=5,
    llm=ChatOpenAI(model="gpt-4o-mini", temperature=0.1),
    allow_delegation=False,
)