import json

with open("data/foodkeeper.json", "r", encoding="utf-8") as file:
    data = json.load(file)

print("Top-level keys:", data.keys())

sheets = data["sheets"]

print("\nNumber of sheets:", len(sheets))

for i, sheet in enumerate(sheets):
    print(f"\n--- Sheet {i + 1} ---")
    print(sheet.keys())
    print("Name:", sheet.get("name"))
    print("Rows:", len(sheet.get("data", [])))

    if sheet.get("name") == "Product":
        print("\nFIRST 3 PRODUCT RECORDS:")
        for row in sheet.get("data", [])[:3]:
            print(row)