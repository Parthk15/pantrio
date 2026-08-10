class Inventory:
    def __init__(self):
        self.items = {}

    def add_item(self, item):
        name = item["name"]

        if name in self.items:
            self.items[name]["quantity"] += item["quantity"]
        else:
            self.items[name] = {
                "quantity": item["quantity"],
                "unit": item["unit"],
                "price": item["price"]
            }

    def show_inventory(self):
        print("\n========== PANTRIO INVENTORY ==========\n")

        for name, item in self.items.items():
            print(
                f"{name}: "
                f"{item['quantity']} {item['unit']} "
                f"(₹{item['price']})"
            )

        print("\n=======================================\n")


if __name__ == "__main__":
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
        "name": "Milk",
        "quantity": 2.0,
        "unit": "L",
        "price": 120.0
    })

    inventory.show_inventory()