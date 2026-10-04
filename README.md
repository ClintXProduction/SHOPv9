# CLTX4 MARKETPLACE

**Electronics • IoT • DIY • Tech • More**

A futuristic, responsive, static e-commerce storefront designed for GitHub Pages.

## Features

- HTML + CSS + Vanilla JavaScript
- Product catalog loaded from `data/products.json`
- Search by product name, category, ID and description
- Category filtering and price/name sorting
- Clickable product details modal
- Shopping cart with quantity controls and `localStorage`
- English 🇺🇸 / Filipino 🇵🇭 switcher
- Dark/light theme
- Responsive mobile/desktop UI
- PHP / ₱ pricing
- Stock and product badges
- Optional local Python product manager
- No server, database or Node.js required for the public site

## Project Structure

```text
CLTX4_MARKETPLACE/
├── index.html
├── style.css
├── script.js
├── data/
│   └── products.json
├── assets/
│   └── images/
│       └── products/
├── python_tools/
│   └── product_manager.py
├── favicon.svg
└── README.md
```

## Add or Edit a Product

### 1. Put your product picture here

```text
assets/images/products/
```

For example:

```text
assets/images/products/esp32-s3.jpg
```

### 2. Open

```text
data/products.json
```

### 3. Copy this product template

```json
{
  "id": "ESP32-S3-001",
  "name": "ESP32-S3 Development Board",
  "filipinoName": "ESP32-S3 Development Board",
  "category": "ESP32",
  "price": 450,
  "stock": 10,
  "image": "assets/images/products/esp32-s3.jpg",
  "badge": "NEW",
  "description": "Your English product description.",
  "filipinoDescription": "Ang Filipino product description mo."
}
```

### 4. Change the fields

- `id` = unique product ID
- `name` = English product name
- `filipinoName` = Filipino product name
- `category` = category label
- `price` = PHP price
- `stock` = available quantity
- `image` = image path
- `badge` = NEW, FEATURED, POPULAR, LOW STOCK, or blank
- `description` = English description
- `filipinoDescription` = Filipino description

The public website automatically reads the JSON file.

## Change Price

Find the product and edit:

```json
"price": 450
```

Save the file and reload the website.

## Change Stock

```json
"stock": 25
```

A stock of `0` makes the product unavailable for cart adding.

## Change Image

Put the new image inside:

```text
assets/images/products/
```

Then change:

```json
"image": "assets/images/products/my-product.jpg"
```

JPG, JPEG, PNG, WEBP and SVG can be used.

## Remove a Product

Delete the entire product object from `data/products.json`.

Be careful to keep valid JSON commas.

## Add a Category

You do not need a separate category file. Any new category text in a product automatically appears in the category filter and category section.

Example:

```json
"category": "Power Supply"
```

## Python Product Manager

The Python tool is optional and runs locally.

Requirements:

- Python 3

Run:

```bash
cd python_tools
python product_manager.py
```

It provides:

```text
[1] List Products
[2] Add Product
[3] Edit Product
[4] Delete Product
[5] Change Price
[6] Change Stock
[7] Change Image
[8] Exit
```

The Python tool directly updates:

```text
data/products.json
```

It is **not** a server and GitHub Pages does not need Python.

## GitHub Pages Deployment

1. Create a GitHub repository, for example:

```text
CLTX4_MARKETPLACE
```

2. Upload the complete project.

3. Commit and push to the `main` branch.

4. Open:

**Repository → Settings → Pages**

5. Under **Build and deployment**, select:

```text
Deploy from a branch
```

6. Select:

```text
main
/ (root)
```

7. Save.

GitHub will provide your Pages address.

### Important

Do not open the site only by double-clicking `index.html` if your browser blocks local `fetch()` requests. For normal GitHub Pages hosting, `data/products.json` loads normally over HTTPS.

## GitHub Pages Limitations

GitHub Pages is static hosting.

The public shop does **not** use:

- PHP
- MySQL
- Flask
- Django
- Node.js server
- Server-side authentication

The cart is stored locally in the visitor's browser.

The checkout button prepares an order-request email. For real payment processing, use a proper payment provider/backend outside this static project.

## Security

Never put these in frontend files:

- API keys
- passwords
- private tokens
- payment secrets
- database credentials

A JavaScript password is not secure authentication. Keep administrator operations local or use a real authenticated backend if you later need secure online management.

## Customization

Main visual settings are in:

```text
style.css
```

Product behavior is in:

```text
script.js
```

Catalog data is in:

```text
data/products.json
```

Images are in:

```text
assets/images/products/
```

## License / Ownership

Customize this section for your own business terms before public commercial use.

© 2026 CLTX4 MARKETPLACE.
