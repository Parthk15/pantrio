import os
import sys

# Ensure src directory is in Python path
src_dir = os.path.dirname(os.path.abspath(__file__))
if src_dir not in sys.path:
    sys.path.insert(0, src_dir)

import shutil
import tempfile

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

from ocr_reader import extract_text
from bill_parser import parse_bill_text


app = FastAPI(title="Pantrio API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "Pantrio API is running"
    }


@app.post("/api/scan-bill")
async def scan_bill(file: UploadFile = File(...)):

    suffix = os.path.splitext(file.filename)[1]

    with tempfile.NamedTemporaryFile(
        delete=False,
        suffix=suffix
    ) as temp_file:

        shutil.copyfileobj(file.file, temp_file)
        temp_path = temp_file.name

    try:
        ocr_result = extract_text(temp_path)

        if not ocr_result:
            return {
                "success": False,
                "message": "No text detected from bill.",
                "items": []
            }

        ocr_text = "\n".join(ocr_result)

        result = parse_bill_text(ocr_text)

        return {
            "success": True,
            "items": result["items"]
        }

    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)