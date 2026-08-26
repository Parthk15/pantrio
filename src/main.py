import os
import sys

# Ensure src directory is in Python path
src_dir = os.path.dirname(os.path.abspath(__file__))
if src_dir not in sys.path:
    sys.path.insert(0, src_dir)

from ocr_reader import extract_text
from bill_parser import parse_bill_text
from inventory import Inventory
from recipe_suggester import suggest_recipes
from recipe_engine import consume_recipe


def main():

    print("\n========================================")
    print("              PANTRIO")
    print("       Smart Pantry Management")
    print("========================================\n")

    # Step 1: Get bill image path
    image_path = input("Enter bill image path [default: data/bill.jpeg]: ").strip()

    if not image_path:
        default_path = os.path.join(os.path.dirname(src_dir), "data", "bill.jpeg")
        if os.path.exists(default_path):
            image_path = default_path
        elif os.path.exists("data/bill.jpeg"):
            image_path = "data/bill.jpeg"
        else:
            print("No image path provided.")
            return

    # Step 2: Run OCR on the bill
    print("\nReading bill...\n")

    print(">>> OCR START")
    ocr_result = extract_text(temp_path)
    print(">>> OCR END")

    if not ocr_result:
        print("No text detected from the bill.")
        return

    # OCR reader already returns a list of text strings
    ocr_text = "\n".join(ocr_result)

    # Step 3: Parse OCR text
    result = parse_bill_text(ocr_text)

    if not result["items"]:
        print("\nNo grocery items could be extracted from the bill.")
        return

    # Step 4: Create inventory
    inventory = Inventory()

    # Step 5: Add parsed items to inventory
    for item in result["items"]:
        inventory.add_item(item)

    # Step 6: Display inventory
    inventory.show_inventory()

    # Step 7: Suggest recipes
    suggestions = suggest_recipes(inventory)

    print("\n========== RECIPE SUGGESTIONS ==========\n")

    available_recipes = []

    for suggestion in suggestions:

        if suggestion["can_make"]:

            available_recipes.append(suggestion["recipe"])

            print(
                f"{len(available_recipes)}. "
                f"{suggestion['recipe']}"
            )

        else:

            print(
                f"⚠️ {suggestion['recipe']} "
                f"(Missing: {', '.join(suggestion['missing'])})"
            )

    print("\n=========================================\n")

    # Step 8: Check if any recipe can be made
    if not available_recipes:
        print("No recipes can be made with the current inventory.")
        return

    # Step 9: Ask user to choose a recipe
    print("Choose a recipe to make:")

    choice = input("Enter recipe number: ").strip()

    if not choice.isdigit():
        print("Please enter a valid number.")
        return

    choice = int(choice)

    if choice < 1 or choice > len(available_recipes):
        print("Invalid recipe number.")
        return

    selected_recipe = available_recipes[choice - 1]

    print(f"\nMaking {selected_recipe}...\n")

    # Step 10: Consume ingredients
    success = consume_recipe(
        inventory,
        selected_recipe
    )

    if not success:
        return

    print(
        f"✅ {selected_recipe} "
        "completed successfully!"
    )

    # Step 11: Show updated inventory
    print("\n========== UPDATED INVENTORY ==========\n")

    inventory.show_inventory()

    # Step 12: Low-stock thresholds
    thresholds = {
        "Tomato": 0.5,
        "Rice": 1.0,
        "Onion": 0.5,
        "Milk": 1.0,
        "Apples": 2.0,
        "Bread": 1.0
    }

    # Step 13: Check low stock
    low_stock = inventory.get_low_stock(thresholds)

    print("\n========== LOW STOCK AFTER COOKING ==========\n")

    if low_stock:

        for name, item in low_stock.items():

            print(
                f"⚠️ {name}: "
                f"{item['quantity']} {item['unit']}"
            )

    else:

        print("No low-stock items.")

    print("\n==============================================\n")


if __name__ == "__main__":
    main()