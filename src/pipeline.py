from bill_parser import parse_bill_text
from inventory import Inventory
from recipe_suggester import suggest_recipes
from recipe_engine import consume_recipe


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


# Step 1: Parse bill
result = parse_bill_text(sample_text)


# Step 2: Create inventory
inventory = Inventory()


# Step 3: Add parsed items to inventory
for item in result["items"]:
    inventory.add_item(item)


# Step 4: Display inventory
inventory.show_inventory()


# Step 5: Suggest recipes
suggestions = suggest_recipes(inventory)

print("\n========== RECIPE SUGGESTIONS ==========\n")

available_recipes = []

for suggestion in suggestions:
    if suggestion["can_make"]:
        available_recipes.append(suggestion["recipe"])
        print(f"{len(available_recipes)}. {suggestion['recipe']}")
    else:
        print(
            f"⚠️ {suggestion['recipe']} "
            f"(Missing: {', '.join(suggestion['missing'])})"
        )

print("\n=========================================\n")


# Step 6: Ask user to choose a recipe
if available_recipes:

    print("Choose a recipe to make:")
    
    choice = input("Enter recipe number: ").strip()

    if choice.isdigit():

        choice = int(choice)

        if 1 <= choice <= len(available_recipes):

            selected_recipe = available_recipes[choice - 1]

            print(f"\nMaking {selected_recipe}...\n")

            # Step 7: Consume ingredients
            success = consume_recipe(
                inventory,
                selected_recipe
            )

            if success:
                print(
                    f"✅ {selected_recipe} "
                    "completed successfully!"
                )

                print(
                    "\n========== UPDATED INVENTORY ==========\n"
                )

                inventory.show_inventory()

        else:
            print("Invalid recipe number.")

    else:
        print("Please enter a valid number.")

else:
    print("No recipes can be made with the current inventory.")