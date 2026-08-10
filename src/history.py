from datetime import datetime


class CookingHistory:

    def __init__(self):
        self.history = []

    def add_recipe(self, recipe_name, ingredients):
        record = {
            "recipe": recipe_name,
            "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "ingredients": ingredients.copy()
        }

        self.history.append(record)

    def show_history(self):

        print("\n========== COOKING HISTORY ==========\n")

        if not self.history:
            print("No cooking history yet.")
        else:
            for index, record in enumerate(self.history, start=1):

                print(
                    f"{index}. {record['recipe']} "
                    f"({record['date']})"
                )

                print("   Ingredients used:")

                for ingredient, quantity in record["ingredients"].items():
                    print(
                        f"   - {ingredient}: {quantity}"
                    )

        print("\n=====================================\n")


if __name__ == "__main__":

    history = CookingHistory()

    history.add_recipe(
        "Tomato Rice",
        {
            "Tomato": 0.5,
            "Rice": 1.0,
            "Onion": 0.5
        }
    )

    history.add_recipe(
        "Milk Rice",
        {
            "Rice": 1.0,
            "Milk": 0.5
        }
    )

    history.show_history()