def suggest_purchases(inventory, thresholds):
    purchases = []

    for name, threshold in thresholds.items():

        if name not in inventory.items:
            continue

        item = inventory.items[name]
        quantity = item["quantity"]

        if quantity <= threshold:

            suggested_quantity = threshold - quantity

            purchases.append({
                "name": name,
                "quantity": quantity,
                "unit": item["unit"],
                "suggested_quantity": suggested_quantity
            })

    return purchases


if __name__ == "__main__":
    print("Purchase suggester loaded successfully.")



    