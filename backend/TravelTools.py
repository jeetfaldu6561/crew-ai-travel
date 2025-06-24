import os
from dotenv import load_dotenv
from crewai.tools import tool
from langchain.vectorstores import Chroma
from langchain.embeddings import OpenAIEmbeddings
from langchain_community.utilities import GoogleSerperAPIWrapper

# Load environment variables from .env file
load_dotenv()

# Set the Serper API key for GoogleSerperAPIWrapper
os.environ["SERPER_API_KEY"] = os.getenv("serper_api_key")

# Path to persist Chroma vector store
CHROMA_PATH = "travel_kb"

# === Vector Store Setup ===

def get_vectorstore():
    """
    Initializes or loads the persistent Chroma vector store using OpenAI embeddings.
    """
    embeddings = OpenAIEmbeddings()
    if not os.path.exists(CHROMA_PATH):
        os.makedirs(CHROMA_PATH)
    return Chroma(persist_directory=CHROMA_PATH, embedding_function=embeddings)

# === RAG Tool: Retrieve Itinerary from Vector DB ===

@tool
def retrieve_itinerary_from_kb(query: str, destination: str) -> str:
    """
    Retrieves past itineraries from vector store based on a query and destination filter.
    If no relevant documents are found, returns a fallback message.
    """
    try:
        vectorstore = get_vectorstore()
        docs = vectorstore.similarity_search(
            query=query,
            k=3,
            filter={"destination": destination.lower()}
        )
        if docs:
            print("[RAG] Retrieved similar itinerary from vector DB ✅")
            return "\n\n".join([doc.page_content for doc in docs])
        else:
            print("[RAG] No relevant itineraries found — fallback to LLM ❌")
            return "No similar past itineraries found."
    except Exception as e:
        print(f"[RAG] Retrieval error: {e}")
        return "Retrieval failed."

# === Web Search Tool: GoogleSerper ===

@tool
def search_web_tool(query: str) -> str:
    """
    Performs a real-time web search using GoogleSerperAPIWrapper.
    Useful when no cached itinerary is available or for up-to-date events.
    """
    try:
        search = GoogleSerperAPIWrapper()
        results = search.run(query)
        print(f"[Web Search] Query: {query}")
        return results
    except Exception as e:
        print(f"[Web Search] Failed: {e}")
        return "Web search failed or timed out."
