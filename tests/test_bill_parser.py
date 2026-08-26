import os
import sys

# Ensure src directory is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "src")))

from bill_parser import parse_bill_text, classify_category, normalize_item_name


def test_mandatory_grocery_receipt_items():
    sample_text = """
    FRESHMART SUPERMARKET
    Nagpur, Maharashtra
    GSTIN: 27ABCDE1234F1Z5
    Bill No: FM-2026-08421
    Date: 26/08/2026

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
    SGST (2.5%): 25.50
    CGST (2.5%): ₹25.50
    GRAND TOTAL: 1071.00
    """

    res = parse_bill_text(sample_text)
    items = res["items"]

    assert len(items) == 10

    expected_map = {
        "Amul Taaza Milk": {"quantity": 2.0, "unit": "L", "category": "Dairy"},
        "Aashirvaad Atta": {"quantity": 5.0, "unit": "kg", "category": "Pantry"},
        "Tata Salt": {"quantity": 1.0, "unit": "kg", "category": "Pantry"},
        "Fortune Sunflower Oil": {"quantity": 1.0, "unit": "L", "category": "Pantry"},
        "Tomato": {"quantity": 1.0, "unit": "kg", "category": "Produce"},
        "Onion": {"quantity": 2.0, "unit": "kg", "category": "Produce"},
        "Potato": {"quantity": 2.0, "unit": "kg", "category": "Produce"},
        "Mother Dairy Yogurt": {"quantity": 400.0, "unit": "g", "category": "Dairy"},
        "Britannia Bread": {"quantity": 400.0, "unit": "g", "category": "Pantry"},
        "Kellogg's Cornflakes": {"quantity": 300.0, "unit": "g", "category": "Grocery"}
    }

    for item in items:
        name = item["name"]
        assert name in expected_map, f"Unexpected item: {name}"
        expected = expected_map[name]
        assert item["quantity"] == expected["quantity"], f"Mismatch quantity for {name}: {item['quantity']} != {expected['quantity']}"
        assert item["unit"] == expected["unit"], f"Mismatch unit for {name}: {item['unit']} != {expected['unit']}"
        assert item["category"] == expected["category"], f"Mismatch category for {name}: {item['category']} != {expected['category']}"


def test_malformed_lines_gracefully_handled():
    malformed_text = """
    @@@ INVALID NOISE LINE ###
    ---
    1234567890
    Subtotal: 500
    GRAND TOTAL: 500
    Random word without unit 45.00
    """
    res = parse_bill_text(malformed_text)
    assert isinstance(res["items"], list)
    assert len(res["items"]) == 0


def test_single_line_bill_format():
    single_line_text = """
    TOMATO 1 KG 45.00
    RICE 5 KG 320.00
    ONION 2 KG 80.00
    MILK 2 L 120.00
    """
    res = parse_bill_text(single_line_text)
    items = res["items"]
    assert len(items) == 4
    names = [i["name"] for i in items]
    assert "Tomato" in names
    assert "Rice" in names
    assert "Onion" in names
    assert "Milk" in names


def test_category_classifier():
    assert classify_category("Amul Taaza Milk") == "Dairy"
    assert classify_category("Mother Dairy Yogurt") == "Dairy"
    assert classify_category("Fresh Tomato") == "Produce"
    assert classify_category("Red Onions") == "Produce"
    assert classify_category("Aashirvaad Atta") == "Pantry"
    assert classify_category("Fortune Sunflower Oil") == "Pantry"
    assert classify_category("Cornflakes Cereal") == "Grocery"
    assert classify_category("Unknown Exotic Item") == "Other"


if __name__ == "__main__":
    print("Running Pantrio Parser Unit Tests...")
    test_mandatory_grocery_receipt_items()
    print("  [PASS] test_mandatory_grocery_receipt_items")
    test_malformed_lines_gracefully_handled()
    print("  [PASS] test_malformed_lines_gracefully_handled")
    test_single_line_bill_format()
    print("  [PASS] test_single_line_bill_format")
    test_category_classifier()
    print("  [PASS] test_category_classifier")
    print("ALL PANTRIO PARSER TESTS PASSED SUCCESSFULLY!")
