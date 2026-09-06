import os
from dotenv import load_dotenv
from google import genai

load_dotenv()


# Read the API key from .env
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY was not found.")


# Connect to Gemini
client = genai.Client(api_key=api_key)


# Send a simple test question
response = client.models.generate_content(
    model="gemini-3.6-flash",
    contents="Explain heatwave in one simple sentence."
)


print("\n===== GEMINI RESPONSE =====\n")
print(response.text)
