import os
import sys
import time

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

    start_req = time.perf_counter()
    suffix = os.path.splitext(file.filename)[1]

    with tempfile.NamedTemporaryFile(
        delete=False,
        suffix=suffix
    ) as temp_file:

        shutil.copyfileobj(file.file, temp_file)
        temp_path = temp_file.name

    save_time = time.perf_counter() - start_req

    try:
        t_ocr_start = time.perf_counter()
        ocr_result = extract_text(temp_path)
        ocr_duration = time.perf_counter() - t_ocr_start

        if not ocr_result:
            return {
                "success": False,
                "message": "No text detected from bill.",
                "items": []
            }

        ocr_text = "\n".join(ocr_result)

        t_parse_start = time.perf_counter()
        result = parse_bill_text(ocr_text)
        parse_duration = time.perf_counter() - t_parse_start

        total_duration = time.perf_counter() - start_req
        print(f"[PROFILE] Upload Save: {save_time:.4f}s | OCR: {ocr_duration:.4f}s | Parser: {parse_duration:.4f}s | Total API: {total_duration:.4f}s")

        return {
            "success": True,
            "items": result["items"]
        }

    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)