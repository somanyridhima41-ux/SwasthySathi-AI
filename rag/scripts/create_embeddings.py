from pathlib import Path
import json
from sentence_transformers import SentenceTransformer


# Input and output files
input_file = Path("rag/metadata/knowledge_base.json")
output_file = Path("rag/metadata/knowledge_base_embeddings.json")


# Load the knowledge base
with open(input_file, "r", encoding="utf-8") as file:
    records = json.load(file)


print(f"Loaded {len(records)} chunks.")


# Load the embedding model
print("Loading embedding model...")

model = SentenceTransformer("all-MiniLM-L6-v2")

print("Embedding model loaded!")


# Create embeddings
texts = [record["text"] for record in records]

embeddings = model.encode(
    texts,
    show_progress_bar=True
)


# Add embeddings to each record
for record, embedding in zip(records, embeddings):
    record["embedding"] = embedding.tolist()


# Save the result
with open(output_file, "w", encoding="utf-8") as file:
    json.dump(records, file, ensure_ascii=False)


print("Embeddings created successfully!")
print(f"Saved to: {output_file}")