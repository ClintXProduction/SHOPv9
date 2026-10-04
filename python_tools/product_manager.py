#!/usr/bin/env python3
"""
CLTX4 MARKETPLACE - Local Product Manager
This tool edits ../data/products.json.
It does NOT run a web server and is not needed by GitHub Pages.
Run from this folder:
    python product_manager.py
"""
import json
from pathlib import Path

DATA = Path(__file__).resolve().parent.parent / "data" / "products.json"

def load():
    with DATA.open("r", encoding="utf-8") as f:
        return json.load(f)

def save(products):
    with DATA.open("w", encoding="utf-8") as f:
        json.dump(products, f, indent=2, ensure_ascii=False)

def ask(prompt, default=""):
    value = input(f"{prompt}" + (f" [{default}]" if default else "") + ": ").strip()
    return value or default

def list_products(products):
    print("\n--- CLTX4 PRODUCT CATALOG ---")
    for i,p in enumerate(products,1):
        print(f"{i:>3}. {p['id']:<16} {p['name'][:38]:<38} ₱{p['price']:.2f}  stock={p['stock']}")
    print()

def add_product(products):
    p = {
        "id": ask("Product ID"),
        "name": ask("English name"),
        "filipinoName": ask("Filipino name"),
        "category": ask("Category", "Others"),
        "price": float(ask("Price", "0")),
        "stock": int(ask("Stock", "0")),
        "image": ask("Image path", "assets/images/products/product.jpg"),
        "badge": ask("Badge (NEW/FEATURED/POPULAR/LOW STOCK or blank)", ""),
        "description": ask("English description"),
        "filipinoDescription": ask("Filipino description")
    }
    if any(x["id"] == p["id"] for x in products):
        print("That ID already exists.")
        return
    products.append(p); save(products); print("Product added.")

def edit_product(products):
    list_products(products)
    key = ask("Enter Product ID to edit")
    p = next((x for x in products if x["id"] == key), None)
    if not p:
        print("Product not found."); return
    p["name"] = ask("English name", p["name"])
    p["filipinoName"] = ask("Filipino name", p.get("filipinoName",""))
    p["category"] = ask("Category", p["category"])
    p["price"] = float(ask("Price", str(p["price"])))
    p["stock"] = int(ask("Stock", str(p["stock"])))
    p["image"] = ask("Image path", p["image"])
    p["badge"] = ask("Badge", p.get("badge",""))
    p["description"] = ask("English description", p["description"])
    p["filipinoDescription"] = ask("Filipino description", p.get("filipinoDescription",""))
    save(products); print("Product updated.")

def delete_product(products):
    key = ask("Enter Product ID to delete")
    before = len(products)
    products[:] = [x for x in products if x["id"] != key]
    if len(products) == before: print("Product not found.")
    else: save(products); print("Product deleted.")

def main():
    while True:
        products = load()
        print("\nCLTX4 PRODUCT MANAGER")
        print("[1] List Products")
        print("[2] Add Product")
        print("[3] Edit Product")
        print("[4] Delete Product")
        print("[5] Change Price")
        print("[6] Change Stock")
        print("[7] Change Image")
        print("[8] Exit")
        choice = input("Choose: ").strip()
        if choice == "1": list_products(products)
        elif choice == "2": add_product(products)
        elif choice == "3": edit_product(products)
        elif choice == "4": delete_product(products)
        elif choice == "5":
            key=ask("Product ID"); p=next((x for x in products if x["id"]==key),None)
            if p: p["price"]=float(ask("New price",str(p["price"]))); save(products); print("Price updated.")
            else: print("Product not found.")
        elif choice == "6":
            key=ask("Product ID"); p=next((x for x in products if x["id"]==key),None)
            if p: p["stock"]=int(ask("New stock",str(p["stock"]))); save(products); print("Stock updated.")
            else: print("Product not found.")
        elif choice == "7":
            key=ask("Product ID"); p=next((x for x in products if x["id"]==key),None)
            if p: p["image"]=ask("New image path",p["image"]); save(products); print("Image updated.")
            else: print("Product not found.")
        elif choice == "8": break
        else: print("Invalid option.")

if __name__ == "__main__":
    main()
