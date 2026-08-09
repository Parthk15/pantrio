from paddleocr import PaddleOCR


def extract_text(image_path):
    ocr = PaddleOCR(
        lang="en",
        enable_mkldnn=False
    )

    result = ocr.predict(image_path)

    # Extract only recognized text
    texts = result[0]["rec_texts"]

    return texts


if __name__ == "__main__":
    image_path = input("Enter bill image path: ").strip()

    result = extract_text(image_path)

    print("\n========== OCR RESULT ==========\n")

    for text in result:
        print(text)

    print("\n================================\n")
