class Inventory:
    def __init__(self):
        self.items = {}

    def add_item(self, item):
        name = item["name"]

        if name in self.items:
            self.items[name]["quantity"] += item["quantity"]
            if "category" in item and item["category"]:
                self.items[name]["category"] = item["category"]
        else:
            self.items[name] = {
                "quantity": item["quantity"],
                "unit": item["unit"],
                "category": item.get("category", "Other"),
                "price": item.get("price")
            }

    def get_low_stock(self, thresholds):
        low_stock = {}

        for name, item in self.items.items():
            if name in thresholds:
                if item["quantity"] <= thresholds[name]:
                    low_stock[name] = {
                        "quantity": item["quantity"],
                        "unit": item["unit"]
                    }

        return low_stock

    def show_inventory(self):
        print("\n========== PANTRIO INVENTORY ==========\n")

        for name, item in self.items.items():
            cat_str = f" [{item['category']}]" if "category" in item else ""
            print(
                f"{name}{cat_str}: "
                f"{item['quantity']} {item['unit']}"
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

    thresholds = {
        "Tomato": 0.5,
        "Rice": 2.0,
        "Milk": 1.0,
        "Onion": 1.0
    }

    low_stock = inventory.get_low_stock(thresholds)

    print("\n========== LOW STOCK ==========\n")

    if low_stock:
        for name, item in low_stock.items():
            print(
                f"{name}: "
                f"{item['quantity']} {item['unit']}"
            )
    else:
        print("No low-stock items.")

    print("\n===============================\n")