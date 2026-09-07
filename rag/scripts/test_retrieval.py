import chromadb
from sentence_transformers import SentenceTransformer


# Connect to our existing vector database
client = chromadb.PersistentClient(
    path="rag/vector_db"
)

collection = client.get_collection(
    name="swasthyasathi_research"
)


# Load the same embedding model used for our research chunks
model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)


# Test question
question = "How does extreme heat affect elderly people?"


print("\nQuestion:")
print(question)


# Convert the question into an embedding
question_embedding = model.encode(
    question
).tolist()


# Search ChromaDB
results = collection.query(
    query_embeddings=[question_embedding],
    n_results=5,
    include=[
        "documents",
        "metadatas",
        "distances"
    ]
)


print("\n===== TOP RESEARCH RESULTS =====\n")


for i in range(len(results["documents"][0])):

    metadata = results["metadatas"][0][i]
    document = results["documents"][0][i]
    distance = results["distances"][0][i]

    print(f"RESULT {i + 1}")
    print("=" * 60)

    print("Relevance distance:", round(distance, 4))

    print("Paper ID:", metadata["paper_id"])
    print("Title:", metadata["title"])
    print("Year:", metadata["year"])
    print("Category:", metadata["category"])
    print("Study type:", metadata["study_type"])

    print("\nSource:")
    print(metadata["official_url"])

    print("\nRelevant research text:")
    print(document[:1000])

    print("\n")