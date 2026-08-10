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
    },

    "Milk Rice": {
        "ingredients": {
            "Rice": 1.0,
            "Milk": 0.5
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


def consume_recipe(inventory, recipe_name):

    if recipe_name not in RECIPES:
        print(f"Recipe '{recipe_name}' not found.")
        return False

    recipe = RECIPES[recipe_name]

    # Check ingredients first
    for ingredient, required_quantity in recipe["ingredients"].items():

        if ingredient not in inventory.items:
            print(f"Missing ingredient: {ingredient}")
            return False

        available_quantity = inventory.items[ingredient]["quantity"]

        if available_quantity < required_quantity:
            print(
                f"Not enough {ingredient}. "
                f"Available: {available_quantity}, "
                f"Required: {required_quantity}"
            )
            return False

    # Consume ingredients
    for ingredient, required_quantity in recipe["ingredients"].items():
        inventory.items[ingredient]["quantity"] -= required_quantity

    return True