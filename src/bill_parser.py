import re


# Units that Pantrio understands
UNITS = {
    "kg": "kg",
    "kgs": "kg",
    "kilogram": "kg",
    "kilograms": "kg",
    "g": "g",
    "gm": "g",
    "gms": "g",
    "gram": "g",
    "grams": "g",
    "l": "L",
    "ltr": "L",
    "litre": "L",
    "liter": "L",
    "ml": "ml",
    "millilitre": "ml",
    "milliliter": "ml",
    "pcs": "piece",
    "pc": "piece",
    "piece": "piece",
    "pieces": "piece",
    "pkt": "packet",
    "pack": "packet",
    "packet": "packet",
    "packets": "packet",
    "dozen": "dozen"
}


def normalize_unit(unit):
    """Convert different unit spellings into one standard unit."""
    unit = unit.lower().strip()
    return UNITS.get(unit, unit)


NAME_MAPPINGS = {
    "Tomatoes": "Tomato",
    "Onions": "Onion",
    "Milks": "Milk",
    "Rices": "Rice",
    "Spinach": "Spinach",
    "Yogurt": "Yogurt"
}


def normalize_item_name(name):
    """Clean and standardize an item name."""
    name = name.strip()
    name = re.sub(r"\s+", " ", name)
    name = name.strip("-:.,/")

    title_name = name.title()

    return NAME_MAPPINGS.get(title_name, title_name)


def extract_quantity_unit(text):
    """Find quantity + unit inside text."""
    match = re.search(
        r"(\d+(?:\.\d+)?)\s*"
        r"(kg|kgs|kilogram|kilograms|g|gm|gms|gram|grams|"
        r"l|ltr|litre|liter|ml|millilitre|milliliter|"
        r"pcs|pc|piece|pieces|pkt|pack|packet|packets|dozen)\b",
        text,
        re.IGNORECASE
    )

    if not match:
        return None

    return {
        "quantity": float(match.group(1)),
        "unit": normalize_unit(match.group(2)),
        "start": match.start(),
        "end": match.end()
    }


def extract_price(text):
    """Extract the last monetary number from a line."""
    matches = re.findall(
        r"(?:₹|Rs\.?|INR)?\s*(\d+(?:\.\d{1,2})?)",
        text,
        re.IGNORECASE
    )

    if not matches:
        return None

    return float(matches[-1])


def parse_bill_line(line):
    """
    Parse a complete item line.

    Example:
        TOMATO 1 KG 45.00
    """
    line = line.strip()

    if not line:
        return None

    quantity_info = extract_quantity_unit(line)

    if not quantity_info:
        return None

    quantity = quantity_info["quantity"]
    unit = quantity_info["unit"]

    # Text before quantity is the item name
    item_name = line[:quantity_info["start"]].strip()

    # Price after quantity/unit
    remaining_text = line[quantity_info["end"]:]

    price = extract_price(remaining_text)

    if not item_name:
        return None

    return {
        "name": normalize_item_name(item_name),
        "quantity": quantity,
        "unit": unit,
        "price": price
    }


def looks_like_item_name(line):
    """Determine whether a line looks like a grocery item name."""
    lower = line.lower()

    ignored_words = [
        "freshmart",
        "nagpur",
        "gstin",
        "bill no",
        "date",
        "time",
        "item name",
        "subtotal",
        "sgst",
        "cgst",
        "total gst",
        "grand total",
        "items:",
        "qty:",
        "thank you",
        "pantrio"
    ]

    if any(word in lower for word in ignored_words):
        return False

    # Must contain letters
    return bool(re.search(r"[A-Za-z]", line))


def parse_bill_text(text):
    """Parse OCR text from a grocery bill."""

    items = []

    lines = [
        line.strip()
        for line in text.splitlines()
        if line.strip()
    ]

    i = 0

    while i < len(lines):
        line = lines[i]

        # Ignore headers and bill summary information
        lower = line.lower()

        if any(keyword in lower for keyword in [
            "freshmart",
            "nagpur",
            "gstin",
            "bill no",
            "date:",
            "time:",
            "item name",
            "subtotal",
            "sgst",
            "cgst",
            "total gst",
            "grand total",
            "items:",
            "qty:",
            "thank you",
            "pantrio"
        ]):
            i += 1
            continue

        # ---------------------------------------------------------
        # FORMAT 1
        # TOMATO 1 KG 45.00
        # ---------------------------------------------------------
        item = parse_bill_line(line)

        if item:
            items.append(item)
            i += 1
            continue

        # ---------------------------------------------------------
        # FORMAT 2
        #
        # Tomato 1 kg
        # 42.00
        # 42.00
        #
        # The first number is rate.
        # The second number is line amount.
        # ---------------------------------------------------------
        quantity_info = extract_quantity_unit(line)

        if quantity_info and looks_like_item_name(line):

            item_name = line[:quantity_info["start"]].strip()

            quantity = quantity_info["quantity"]
            unit = quantity_info["unit"]

            price = None

            # Look at next two lines for monetary values
            future_prices = []

            for offset in range(1, 3):
                if i + offset < len(lines):
                    candidate = lines[i + offset]

                    # Only accept lines that are basically numbers
                    if re.fullmatch(
                        r"(?:₹|Rs\.?|INR)?\s*\d+(?:\.\d{1,2})?",
                        candidate,
                        re.IGNORECASE
                    ):
                        future_prices.append(float(extract_price(candidate)))

            if future_prices:
                # For bills like:
                # Tomato 1 kg
                # 42.00
                # 42.00
                #
                # The final amount is the item price.
                price = future_prices[-1]

            if item_name:
                items.append({
                    "name": normalize_item_name(item_name),
                    "quantity": quantity,
                    "unit": unit,
                    "price": price
                })

                i += 1
                continue

        i += 1

    return {
        "items": items
    }


if __name__ == "__main__":

    sample_text = """
    FRESHMART SUPERMARKET
    Nagpur, Maharashtra
    GSTIN: 27ABCDE1234F1Z5
    Bill No: FM-2026-08421
    Date: 26/08/2026
    Time: 12:18 PM

    Item Name
    Qty
    Rate
    Amount

    Amul Taaza Milk 1L
    2 68.00
    136.00

    Aashirvaad Atta 5kg
    1 285.00
    285.00

    Tata Salt 1kg
    1 28.00
    28.00

    Fortune Sunflwr Oil 1L
    1 145.00
    145.00

    Tomato 1 kg
    42.00
    42.00

    Onion 2 kg
    35.00
    70.00

    Potato 2 kg
    28.00
    56.00

    Mother Dairy Yogurt 400g 1 48.00
    48.00

    Britannia Bread 400g
    1 45.00
    45.00

    Kellogg's CornFlakes 300g 1 165.00
    165.00

    Subtotal: ₹1020.00
    SGST (2.5%):
    25.50
    CGST (2.5%): ₹25.50
    Total GST: ₹51.00
    GRAND TOTAL: 1071.00
    """

    result = parse_bill_text(sample_text)

    print("\n========== PANTRIO PARSER ==========\n")

    total = 0

    for item in result["items"]:
        print(item)

        if item["price"] is not None:
            total += item["price"]

    print(f"\nParsed item total: ₹{total:.2f}")
    print("\n====================================\n")