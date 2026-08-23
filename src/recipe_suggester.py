from recipe_engine import RECIPES


def suggest_recipes(inventory):
    suggestions = []

    for recipe_name, recipe_data in RECIPES.items():

        can_make = True
        missing = []

        ingredients = recipe_data.get("ingredients", recipe_data)

        for ingredient, required_quantity in ingredients.items():

            if ingredient not in inventory.items:
                can_make = False
                missing.append(ingredient)
                continue

            available_quantity = inventory.items[ingredient]["quantity"]

            if available_quantity < required_quantity:
                can_make = False
                missing.append(ingredient)

        suggestions.append({
            "recipe": recipe_name,
            "can_make": can_make,
            "missing": missing
        })

    return suggestions


if __name__ == "__main__":
    from inventory import Inventory

    inventory = Inventory()

    inventory.add_item({
        "name": "Tomato",
        "quantity": 1.0,
        "unit": "kg",
        "price": 45.0
    })

    inventory.add_item({
        "name": "Rice",
        "quantity": 5.0,
        "unit": "kg",
        "price": 320.0
    })

    inventory.add_item({
        "name": "Onion",
        "quantity": 2.0,
        "unit": "kg",
        "price": 80.0
    })

    inventory.add_item({
        "name": "Milk",
        "quantity": 2.0,
        "unit": "L",
        "price": 120.0
    })

    suggestions = suggest_recipes(inventory)

    print("\n========== RECIPE SUGGESTIONS ==========\n")

    for suggestion in suggestions:

        if suggestion["can_make"]:
            print(f"✅ {suggestion['recipe']}")

        else:
            print(f"⚠️ {suggestion['recipe']}")
            print(
                f"   Missing: {', '.join(suggestion['missing'])}"
            )

    print("\n=========================================\n")