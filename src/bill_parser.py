
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


def normalize_item_name(name):
    """Clean and standardize an item name."""
    name = name.strip()

    # Remove extra spaces
    name = re.sub(r"\s+", " ", name)

    # Remove common punctuation
    name = name.strip("-:.,/")

    # Basic capitalization
    return name.title()


def parse_bill_line(line):
    """
    Convert one OCR bill line into structured information.

    Example:
    'TOMATO 1 KG 45.00'

    Returns:
    {
        'name': 'Tomato',
        'quantity': 1.0,
        'unit': 'kg',
        'price': 45.0
    }
    """

    line = line.strip()

    if not line:
        return None

    # Find quantity + unit
    quantity_match = re.search(
        r"(\d+(?:\.\d+)?)\s*"
        r"(kg|kgs|kilogram|kilograms|g|gm|gms|gram|grams|"
        r"l|ltr|litre|liter|ml|millilitre|milliliter|"
        r"pcs|pc|piece|pieces|pkt|pack|packet|packets|dozen)\b",
        line,
        re.IGNORECASE
    )

    if not quantity_match:
        return None

    quantity = float(quantity_match.group(1))
    unit = normalize_unit(quantity_match.group(2))

    # Look for price after the quantity/unit
    remaining_text = line[quantity_match.end():]

    price_match = re.search(
        r"(?:₹|Rs\.?|INR)?\s*(\d+(?:\.\d+)?)",
        remaining_text,
        re.IGNORECASE
    )

    price = float(price_match.group(1)) if price_match else None

    # Everything before quantity is treated as the item name
    item_name = line[:quantity_match.start()]

    item_name = normalize_item_name(item_name)

    if not item_name:
        return None

    return {
        "name": item_name,
        "quantity": quantity,
        "unit": unit,
        "price": price
    }


def parse_bill_text(text):
    """Parse complete OCR text into structured grocery items."""

    items = []

    lines = [
        line.strip()
        for line in text.splitlines()
        if line.strip()
    ]

    i = 0

    while i < len(lines):
        line = lines[i]

        # Format 1:
        # TOMATO 1 KG 45.00
        item = parse_bill_line(line)

        if item:
            items.append(item)
            i += 1
            continue

        # Format 2:
        # # Tomatoes
        # 9.90
        if line.startswith("#"):
            item_name = normalize_item_name(
                line.lstrip("#").strip()
            )

            if i + 1 < len(lines):
                price_match = re.fullmatch(
                    r"(?:₹|Rs\.?|INR)?\s*(\d+(?:\.\d+)?)",
                    lines[i + 1],
                    re.IGNORECASE
                )

                if price_match and item_name:
                    items.append({
                        "name": item_name,
                        "quantity": 1.0,
                        "unit": "piece",
                        "price": float(price_match.group(1))
                    })

                    i += 2
                    continue

        i += 1

    return {
        "items": items
    }


if __name__ == "__main__":

    sample_text = """
    TOMATO 1 KG 45.00
    RICE 5 KG 320.00
    ONION 2 KG 80.00
    MILK 2 L 120.00

    # Apples
    100.00

    # Bread
    40.00
    """

    result = parse_bill_text(sample_text)

    print("\n========== PANTRIO PARSER ==========\n")

    for item in result["items"]:
        print(item)

    print("\n====================================\n")
