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
    "Yogurt": "Yogurt",
    "Fortune Sunflwr Oil": "Fortune Sunflower Oil",
    "Kellogg's CornFlakes": "Kellogg's Cornflakes",
    "Kelloggs Cornflakes": "Kellogg's Cornflakes"
}


def normalize_item_name(name):
    """Clean and standardize an item name without over-normalizing brands."""
    name = name.strip()
    name = re.sub(r"\s+", " ", name)
    name = name.strip("-:.,/# ")

    if name in NAME_MAPPINGS:
        return NAME_MAPPINGS[name]

    # Standardize ALL CAPS OCR names like "TOMATO" to "Tomato"
    if name.isupper():
        title_name = name.title()
    else:
        title_name = name

    return NAME_MAPPINGS.get(title_name, title_name)


CATEGORIES = [
    ("Dairy", ["milk", "yogurt", "curd", "dahi", "butter", "cheese", "paneer", "cream"]),
    ("Produce", ["tomato", "tomatoes", "onion", "onions", "potato", "potatoes", "spinach", "garlic", "ginger", "apple", "apples", "banana", "cucumber", "cabbage", "veg", "fruit"]),
    ("Pantry", ["atta", "flour", "rice", "salt", "sugar", "oil", "sunflower", "dal", "pulses", "spice", "honey", "mustard", "bread"]),
    ("Grocery", ["cornflakes", "cereal", "oats", "pasta", "noodl", "sauce", "ketchup", "soup"]),
    ("Beverages", ["tea", "coffee", "juice", "soda", "drink", "water"]),
    ("Snacks", ["biscuit", "chip", "cookie", "namkeen", "wafer", "snack"]),
    ("Frozen", ["ice cream", "frozen", "peas"])
]


def classify_category(item_name):
    """Assign a sensible grocery category to a detected item name."""
    name_lower = item_name.lower()
    for cat_name, keywords in CATEGORIES:
        if any(kw in name_lower for kw in keywords):
            return cat_name
    return "Other"


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


def looks_like_header_or_footer(line):
    """Determine whether a line looks like header, metadata, or summary noise."""
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
        "pantrio",
        "rate",
        "amount",
        "total",
        "cash receipt",
        "manager",
        "cashier",
        "tax"
    ]

    if any(word in lower for word in ignored_words):
        return True

    return not bool(re.search(r"[A-Za-z]", line))


def parse_bill_text(text):
    """
    Parse OCR text from a grocery bill.
    Extracts name, quantity, unit, and category (prices ignored for Pantrio).
    Supports single-line and multi-line Indian grocery receipt layouts.
    """
    items = []

    lines = [
        line.strip()
        for line in text.splitlines()
        if line.strip()
    ]

    i = 0

    while i < len(lines):
        line = lines[i]

        if looks_like_header_or_footer(line):
            i += 1
            continue

        q_info = extract_quantity_unit(line)

        if q_info:
            item_name = line[:q_info["start"]].strip()

            # If no item name before quantity on current line, check previous line
            if not item_name and i > 0 and not looks_like_header_or_footer(lines[i - 1]):
                item_name = lines[i - 1].strip()

            if item_name:
                unit_qty = q_info["quantity"]
                unit = q_info["unit"]
                multiplier = 1.0
                price = None

                # Check trailing text on current line (e.g. "1 48.00" in "Mother Dairy Yogurt 400g 1 48.00")
                trailing = line[q_info["end"]:].strip()
                m_trail = re.search(r"^(\d+)\s+(?:\d+(?:\.\d{1,2})?)", trailing)

                # Check next line for count multiplier (e.g. "2 68.00" or "1 285.00")
                m_next = None
                if i + 1 < len(lines):
                    m_next = re.search(r"^(\d+)\s+(?:\d+(?:\.\d{1,2})?)", lines[i + 1])

                if m_trail:
                    multiplier = float(m_trail.group(1))
                    price = extract_price(trailing)
                elif m_next:
                    multiplier = float(m_next.group(1))
                    price = extract_price(lines[i + 1])
                    i += 1  # consume multiplier line
                elif trailing:
                    price = extract_price(trailing)

                final_qty = unit_qty * multiplier
                norm_name = normalize_item_name(item_name)
                category = classify_category(norm_name)

                items.append({
                    "name": norm_name,
                    "quantity": final_qty,
                    "unit": unit,
                    "category": category,
                    "price": price
                })

                i += 1

                # Consume subsequent standalone price lines (e.g., "136.00" or "42.00")
                while i < len(lines) and re.fullmatch(r"(?:₹|Rs\.?|INR)?\s*\d+(?:\.\d{1,2})?", lines[i], re.IGNORECASE):
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

    for item in result["items"]:
        print(item)

    print("\n====================================\n")