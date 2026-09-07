from pathlib import Path
import re


processed_folder = Path("rag/processed")
chunks_folder = Path("rag/chunks")

chunks_folder.mkdir(exist_ok=True)

chunk_size = 500
overlap_words = 50


def clean_text(text):

    # Fix words broken across PDF lines
    # Example: "func- tion" → "function"
    text = re.sub(r"(\w+)-\s+(\w+)", r"\1\2", text)

    # Remove common reference sections
    reference_patterns = [
        r"\bReferences\b",
        r"\bREFERENCES\b",
        r"\bBibliography\b",
        r"\bBIBLIOGRAPHY\b"
    ]

    for pattern in reference_patterns:

        match = re.search(pattern, text)

        if match:
            text = text[:match.start()]
            break

    # Clean excessive whitespace
    text = re.sub(r"\s+", " ", text)

    return text.strip()


def split_into_sentences(text):

    # Basic sentence splitting
    sentences = re.split(
        r"(?<=[.!?])\s+",
        text
    )

    return [
        sentence.strip()
        for sentence in sentences
        if sentence.strip()
    ]


for input_file in processed_folder.glob("*.txt"):

    paper_id = input_file.stem

    text = input_file.read_text(
        encoding="utf-8"
    )

    # Clean the extracted PDF text
    text = clean_text(text)

    # Split into sentences
    sentences = split_into_sentences(text)

    chunks = []
    current_chunk = []
    current_words = 0

    for sentence in sentences:

        sentence_words = sentence.split()
        sentence_length = len(sentence_words)

        # If adding this sentence exceeds the chunk size,
        # save the current chunk first.
        if (
            current_words + sentence_length > chunk_size
            and current_chunk
        ):

            chunks.append(
                " ".join(current_chunk)
            )

            # Keep the last few words as overlap
            overlap = []
            overlap_count = 0

            for word in reversed(current_chunk):

                overlap.insert(0, word)
                overlap_count += 1

                if overlap_count >= overlap_words:
                    break

            current_chunk = overlap
            current_words = len(overlap)

        current_chunk.append(sentence)
        current_words += sentence_length

    # Save the final chunk
    if current_chunk:
        chunks.append(
            " ".join(current_chunk)
        )

    # Write chunks to files
    for i, chunk in enumerate(chunks, start=1):

        output_file = (
            chunks_folder /
            f"{paper_id}_chunk_{i}.txt"
        )

        output_file.write_text(
            chunk,
            encoding="utf-8"
        )

    print(
        f"{paper_id} split into {len(chunks)} chunks!"
    )


print("All papers cleaned and sentence-chunked!")