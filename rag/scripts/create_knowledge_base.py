from pathlib import Path
import csv
import json


# Locations of our files and folders
metadata_file = Path("rag/metadata/swasthyasathi_rag_papers.csv")
chunks_folder = Path("rag/chunks")
output_file = Path("rag/metadata/knowledge_base.json")


# Read the research metadata CSV
with open(metadata_file, "r", encoding="utf-8-sig", newline="") as file:
    reader = csv.DictReader(file)

    metadata = {}

    for row in reader:
        metadata[row["id"]] = row


print(f"Loaded metadata for {len(metadata)} research papers.")


# Store all final RAG records here
records = []


# Go through every chunk
for chunk_file in sorted(chunks_folder.glob("*_chunk_*.txt")):

    # Example:
    # H01_chunk_1.txt → H01
    paper_id = chunk_file.stem.split("_chunk_")[0]

    # Find metadata for this paper
    paper = metadata.get(paper_id)

    if paper is None:
        print(f"WARNING: No metadata found for {paper_id}")
        continue

    # Read the chunk text
    text = chunk_file.read_text(encoding="utf-8").strip()

    if not text:
        continue

    # Create one structured record
    record = {
        "chunk_id": chunk_file.stem,
        "text": text,

        "paper_id": paper_id,
        "title": paper["title"],
        "authors": paper["authors"],
        "year": paper["year"],
        "journal": paper["journal"],
        "doi": paper["doi"],

        "official_url": paper["official_url"],
        "pubmed_url": paper["pubmed_url"],

        "category": paper["category"],
        "study_type": paper["study_type"],
        "population": paper["population"],
        "variables": paper["variables"],

        "key_findings": paper["key_findings"],
        "limitations": paper["limitations"],
        "rag_summary": paper["rag_summary"],
        "keywords": paper["keywords"]
    }

    records.append(record)


# Save everything as JSON
output_file.write_text(
    json.dumps(records, ensure_ascii=False, indent=2),
    encoding="utf-8"
)


print(f"Created knowledge base with {len(records)} chunks!")
print(f"Saved to: {output_file}")