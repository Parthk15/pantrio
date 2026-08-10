RECIPES = {
    "Tomato Rice": {
        "ingredients": {
            "Tomato": 0.5,
            "Rice": 1.0,
            "Onion": 0.5
        }
    },

    "Fried Rice": {
        "ingredients": {
            "Rice": 1.0,
            "Onion": 0.5,
            "Tomato": 0.5
        }
    },

    "Tomato Soup": {
        "ingredients": {
            "Tomato": 0.5,
            "Onion": 0.25
        }
    }
}


def find_recipes(inventory):
    possible_recipes = []

    for recipe_name, recipe in RECIPES.items():
        can_make = True

        for ingredient, required_quantity in recipe["ingredients"].items():

            if ingredient not in inventory.items:
                can_make = False
                break

            available_quantity = inventory.items[ingredient]["quantity"]

            if available_quantity < required_quantity:
                can_make = False
                break

        if can_make:
            possible_recipes.append(recipe_name)

    return possible_recipes


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

    recipes = find_recipes(inventory)

    print("\n========== PANTRIO RECIPES ==========\n")

    for recipe in recipes:
        print(recipe)

    print("\n=====================================\n")