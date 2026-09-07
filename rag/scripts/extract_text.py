from pathlib import Path
from pypdf import PdfReader

documents_folder = Path("rag/documents")
processed_folder = Path("rag/processed")

processed_folder.mkdir(exist_ok=True)

for pdf_path in documents_folder.rglob("*.pdf"):

    pdf_name = pdf_path.stem
    output_path = processed_folder / f"{pdf_name}.txt"

    reader = PdfReader(pdf_path)

    with open(output_path, "w", encoding="utf-8") as file:
        for page in reader.pages:
            text = page.extract_text()

            if text:
                file.write(text)
                file.write("\n\n")

    print(f"{pdf_name} extracted successfully!")

print("All PDFs processed!")