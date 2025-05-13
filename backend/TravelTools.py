import os
from dotenv import load_dotenv
from crewai.tools import tool
from langchain_community.utilities import GoogleSerperAPIWrapper

# Load environment variables from .env file
load_dotenv()

# Set the Serper API key for the search
os.environ["SERPER_API_KEY"] = os.getenv("serper_api_key")

# Web search tool using GoogleSerperAPIWrapper
@tool
def search_web_tool(query: str):
    """
    Searches the web and returns results using GoogleSerperAPIWrapper.
    """
    # Initialize the GoogleSerperAPIWrapper
    search = GoogleSerperAPIWrapper()

    # Run the search query
    results = search.run(query)
    
    # Print the query and results
    print(query)
        
    return results
