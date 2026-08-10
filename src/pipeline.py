from bill_parser import parse_bill_text
from inventory import Inventory


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