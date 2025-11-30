# Shopify Checkout Extension

This project is a Shopify app built primarily as a **Checkout UI Extension**. It allows for adding custom functionality to the Shopify checkout experience via a dedicated extension deployed to merchants' stores.

---

## Live Demo

**Live Store:**  
[https://checkout-extension-store-25.myshopify.com/?_ab=0&_bt=eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaEpJaTVqYUdWamEyOTFkQzFsZUhSbGJuTnBiMjR0YzNSdmNtVXRNalV1YlhsemFHOXdhV1o1TG1OdmJRWTZCa1ZVIiwiZXhwIjoiMjAyNS0xMC0wMlQwOTo1Nzo0My41MzBaIiwicHVyIjoicGVybWFuZW50X3Bhc3N3b3JkX2J5cGFzcyJ9fQ%3D%3D--2e6a953f8823e693d8e468a6b436bfb77c60fed2&_fd=0&_sc=1&key=1c205c44df2370564d13c315b3cdce6bcf75dfbd87dd01021aef845385bec1dd&preview_theme_id=181733458285](https://checkout-extension-store-25.myshopify.com/?_ab=0&_bt=eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaEpJaTVqYUdWamEyOTFkQzFsZUhSbGJuTnBiMjR0YzNSdmNtVXRNalV1YlhsemFHOXdhV1o1TG1OdmJRWTZCa1ZVIiwiZXhwIjoiMjAyNS0xMC0wMlQwOTo1Nzo0My41MzBaIiwicHVyIjoicGVybWFuZW50X3Bhc3N3b3JkX2J5cGFzcyJ9fQ%3D%3D--2e6a953f8823e693d8e468a6b436bfb77c60fed2&_fd=0&_sc=1&key=1c205c44df2370564d13c315b3cdce6bcf75dfbd87dd01021aef845385bec1dd&preview_theme_id=181733458285)  
**Store Password:** `123123`

---

## Project Structure

- `README.md` – This file.
- `extensions/checkout-upsell/` – Main folder for the checkout UI extension code.
    - `src/Checkout.tsx` – The extension's main source code for additional checkout UI.
    - `shopify.extension.toml` – Configuration for the extension’s integration with Shopify checkout.
    - `locales/` – Localization files.
- `.vscode/`, `.gitignore`, `.graphqlrc.js`, `.npmrc`, etc. – Project configuration and settings.
- `package.json`, `package-lock.json` – Dependencies and package management.
- `shopify.app.toml` – App configuration for Shopify integration.

---

## Features

- **Shopify Checkout UI Extension:**  
  Fully leverages [Shopify checkout extensibility](https://shopify.dev/docs/apps/checkout).
- **Custom Functionality:**  
  Add banners, upsells, or additional checkout logic at defined extension points.
- **Easy Setup:**  
  Yarn/NPM/PNPM compatible. Just clone and run.

---

## Getting Started

### Requirements

1. [Node.js](https://nodejs.org/en/download/) (LTS recommended)
2. A [Shopify Partner account](https://partners.shopify.com/signup).
3. A [Shopify development store](https://help.shopify.com/en/partners/dashboard/development-stores#create-a-development-store) for testing.

### Installation

Clone the repository and install dependencies:

```sh
git clone https://github.com/Mayukhy/shopify-checkout-extension.git
cd shopify-checkout-extension
yarn install # or npm install or pnpm install
```

### Development

Start the extension with your preferred package manager:

```sh
yarn dev
# or
npm run dev
# or
pnpm run dev
```

Follow the CLI prompts to preview the extension in your Shopify store.

---

## More Resources

- [Introduction to Shopify apps](https://shopify.dev/docs/apps/getting-started)
- [Shopify App Extensions](https://shopify.dev/docs/apps/build/app-extensions)
- [Checkout UI extension documentation](https://shopify.dev/api/checkout-extensions)
- [Shopify CLI](https://shopify.dev/docs/apps/tools/cli)

---

## Security

See `SECURITY.md` for security policies.

---

## License

See repository for license details.
