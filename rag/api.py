import os

import chromadb
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from google import genai


# --------------------------------------------------
# Load environment variables
# --------------------------------------------------

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY was not found.")


# --------------------------------------------------
# Connect to Gemini
# --------------------------------------------------

gemini_client = genai.Client(
    api_key=api_key
)


# --------------------------------------------------
# Connect to ChromaDB
# --------------------------------------------------

chroma_client = chromadb.PersistentClient(
    path="rag/vector_db"
)

collection = chroma_client.get_collection(
    name="swasthyasathi_research"
)


# --------------------------------------------------
# Load embedding model
# --------------------------------------------------

embedding_model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)


# --------------------------------------------------
# Create FastAPI application
# --------------------------------------------------

app = FastAPI(
    title="SwasthyaSathi RAG API"
)


# --------------------------------------------------
# Allow our Next.js frontend to communicate
# with this backend
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:3000",
    "http://localhost:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# Request format
# --------------------------------------------------

class QuestionRequest(BaseModel):
    question: str


# --------------------------------------------------
# Test endpoint
# --------------------------------------------------

@app.get("/")
def home():

    return {
        "message": "SwasthyaSathi RAG API is running!"
    }


# --------------------------------------------------
# RAG endpoint
# --------------------------------------------------

@app.post("/ask")
def ask_question(request: QuestionRequest):

    question = request.question.strip()

    if not question:
        return {
            "answer": "Please enter a question.",
            "sources": []
        }


    # ----------------------------------------------
    # Convert question into embedding
    # ----------------------------------------------

    question_embedding = embedding_model.encode(
        question
    ).tolist()


    # ----------------------------------------------
    # Search ChromaDB
    # ----------------------------------------------

    results = collection.query(
        query_embeddings=[question_embedding],
        n_results=5,
        include=[
            "documents",
            "metadatas",
            "distances"
        ]
    )


    # ----------------------------------------------
    # Build research context
    # ----------------------------------------------

    research_context = ""

    for i in range(
        len(results["documents"][0])
    ):

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


    # ----------------------------------------------
    # Ask Gemini using retrieved research
    # ----------------------------------------------

    prompt = f"""
You are SwasthyaSathi, a health-information AI assistant.

Answer the user's question using the research evidence
provided below.

IMPORTANT RULES:

1. Base research-related claims only on the provided research context.
2. Do not invent studies, statistics, citations, or medical facts.
3. If the research context does not contain enough evidence,
   clearly say so.
4. Explain the answer in simple language.
5. Do not present yourself as a doctor.
6. Do not diagnose the user.
7. For potentially serious symptoms, recommend appropriate
   medical care.
8. Do not create a Research Sources section.
9. Do not invent or modify paper titles, authors, years,
   DOIs, or URLs.

USER QUESTION:

{question}

RESEARCH CONTEXT:

{research_context}
"""


    response = gemini_client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt
    )


    # ----------------------------------------------
    # Create verified sources from ChromaDB
    # ----------------------------------------------

    sources = []
    shown_papers = set()

    for metadata in results["metadatas"][0]:

        paper_id = metadata["paper_id"]

        if paper_id in shown_papers:
            continue

        shown_papers.add(paper_id)

        sources.append({
            "paper_id": paper_id,
            "title": metadata["title"],
            "year": metadata["year"],
            "study_type": metadata["study_type"],
            "doi": metadata["doi"],
            "official_url": metadata["official_url"],
            "pubmed_url": metadata["pubmed_url"]
        })


    # ----------------------------------------------
    # Return answer + sources to frontend
    # ----------------------------------------------

    return {
        "answer": response.text,
        "sources": sources
    }