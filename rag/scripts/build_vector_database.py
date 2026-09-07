from pathlib import Path
import json
import chromadb


# Where our embeddings are stored
input_file = Path("rag/metadata/knowledge_base_embeddings.json")

# Where ChromaDB will store the database
database_folder = "rag/vector_db"


# Load our embeddings
with open(input_file, "r", encoding="utf-8") as file:
    records = json.load(file)

print(f"Loaded {len(records)} chunks.")


# Create a local ChromaDB database
client = chromadb.PersistentClient(path=database_folder)


# Create our research collection
# Remove the old collection if it already exists
try:
    client.delete_collection(
        name="swasthyasathi_research"
    )
    print("Old vector collection deleted.")
except Exception:
    pass


# Create a fresh collection
collection = client.create_collection(
    name="swasthyasathi_research"
)


# Prepare data for ChromaDB
ids = []
documents = []
embeddings = []
metadatas = []


for record in records:

    ids.append(record["chunk_id"])

    documents.append(record["text"])

    embeddings.append(record["embedding"])

    metadatas.append({
        "paper_id": record["paper_id"],
        "title": record["title"],
        "year": record["year"],
        "category": record["category"],
        "study_type": record["study_type"],
        "journal": record["journal"],
        "doi": record["doi"],
        "official_url": record["official_url"],
        "pubmed_url": record["pubmed_url"]
    })


# Add everything to ChromaDB
collection.upsert(
    ids=ids,
    documents=documents,
    embeddings=embeddings,
    metadatas=metadatas
)


print("Vector database created successfully!")
print(f"Stored {collection.count()} chunks.")
print(f"Database location: {database_folder}")