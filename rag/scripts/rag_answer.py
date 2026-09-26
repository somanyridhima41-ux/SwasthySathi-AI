import os
import chromadb

from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
from google import genai


# Load environment variables from .env
load_dotenv()


# Get Gemini API key
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY was not found.")


# Connect to Gemini
gemini_client = genai.Client(
    api_key=api_key
)


# Connect to ChromaDB
chroma_client = chromadb.PersistentClient(
    path="rag/vector_db"
)

collection = chroma_client.get_collection(
    name="swasthyasathi_research"
)


# Load the embedding model
embedding_model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)


# Ask the user for a question
question = input("\nAsk SwasthyaSathi: ")


# Convert the question into an embedding
question_embedding = embedding_model.encode(
    question
).tolist()


# Search the research database
results = collection.query(
    query_embeddings=[question_embedding],
    n_results=5,
    include=[
        "documents",
        "metadatas",
        "distances"
    ]
)


# Build research context for Gemini
research_context = ""

for i in range(len(results["documents"][0])):

    metadata = results["metadatas"][0][i]
    document = results["documents"][0][i]

    research_context += f"""
SOURCE {i + 1}

Paper ID: {metadata["paper_id"]}
Title: {metadata["title"]}
Year: {metadata["year"]}
Study type: {metadata["study_type"]}
Category: {metadata["category"]}

Research text:
{document}

"""


# Create the prompt for Gemini
prompt = f"""
You are SwasthyaSathi, a health-information AI assistant.

Answer the user's question using the research evidence provided below.

IMPORTANT RULES:

1. Base research-related claims only on the provided research context.
2. Do not invent studies, statistics, citations, or medical facts.
3. If the research context does not contain enough evidence, clearly say so.
4. Explain the answer in simple language.
5. Do not present yourself as a doctor.
6. Do not diagnose the user.
7. For potentially serious symptoms, recommend seeking appropriate medical care.
8. Do not create a Research sources section.
9. Do not invent or modify paper titles, authors, years, DOIs, or URLs.

USER QUESTION:
{question}

RESEARCH CONTEXT:
{research_context}
"""


# Ask Gemini to generate the answer
response = gemini_client.models.generate_content(
    model="gemini-3.6-flash",
    contents=prompt
)


# Display the answer
print("\n")
print("=" * 70)
print("SWASTHYASATHI ANSWER")
print("=" * 70)

print(response.text)


# Generate verified research sources from ChromaDB
print("\n")
print("=" * 70)
print("RESEARCH SOURCES")
print("=" * 70)

shown_sources = set()

for metadata in results["metadatas"][0]:

    paper_id = metadata["paper_id"]

    # Avoid showing the same paper multiple times
    if paper_id in shown_sources:
        continue

    shown_sources.add(paper_id)

    print(f"\n[{paper_id}]")
    print("Title:", metadata["title"])
    print("Year:", metadata["year"])
    print("Study type:", metadata["study_type"])

    if metadata["doi"]:
        print("DOI:", metadata["doi"])

    if metadata["official_url"]:
        print("Source:", metadata["official_url"])

    if metadata["pubmed_url"]:
        print("PubMed:", metadata["pubmed_url"])


print("\n")
print("=" * 70)
print("RAG COMPLETE")
print("=" * 70)