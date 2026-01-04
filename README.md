# 🃏 Stacked Deck - Web Client

![Angular](https://img.shields.io/badge/Angular-16%2B-red)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![RxJS](https://img.shields.io/badge/RxJS-Reactive-purple)
![Stripe](https://img.shields.io/badge/Payment-Stripe-blueviolet)

**Stacked Deck Client** is the modern, reactive frontend interface for the *Stacked Deck* marketplace. Built with **Angular**, this Single Page Application (SPA) delivers a seamless user experience for buying and collecting Pokémon TCG cards, featuring an immersive "Dark Mode" aesthetic.

It interacts with the Java Spring Boot API to manage the catalog, user authentication, and order processing.

---

## 📑 Table of Contents

- [Visual Overview (User Journey)](#-visual-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Installation & Setup](#-installation--setup)
- [Configuration](#-configuration)

---

## 📸 Visual Overview

Welcome to *The Underground Marketplace*. Here is a tour of the application.

### 🏠 1. Home & Immersion
The landing page immerses the user in the brand's universe, highlighting flagship products ("Vault Selection") with intuitive navigation.

![Hero Section](src/assets/readme-img/1.png)
*Home screen featuring the Hero Banner and the "Underground Marketplace" identity.*

![Vault Selection](src/assets/readme-img/4.png)
*The "Vault Selection": an interactive carousel of the most exclusive cards.*

---

### 📂 2. Category Navigation
Users can quickly navigate between different product types (Single Cards, Booster Packs, ETBs, Bundles).

![Categories](src/assets/readme-img/3.png)

---

### 🛍️ 3. Catalog & Advanced Search
The catalog features powerful filtering tools (Price range, Product type, Sorting) to help collectors find specific items.

![Catalog](src/assets/readme-img/6.png)

---

### 🔍 4. Product Details
Each card has a detailed view allowing users to select the specific condition (Near Mint, Played, etc.) before adding it to the cart.

![Product Details](src/assets/readme-img/7.png)

---

### 🛒 5. Cart & Orders
Complete cart management system with quantity adjustments, promo code application, and order summary before checkout.

![Cart](src/assets/readme-img/8.png)

---

### 🔐 6. Secure Authentication
Access to account features and payment requires secure authentication.

![Login](src/assets/readme-img/9.png)
*Login page: "Welcome to the Vault".*

---

### 💳 7. Payment & Checkout
The application integrates a full, secure payment tunnel via **Stripe**.

| Checkout | Stripe Payment |
| :---: | :---: |
| ![Checkout](src/assets/readme-img/10.png) | ![Stripe](src/assets/readme-img/11.png) |
| *Address validation and shipping* | *Secure credit card entry form* |

---

## 🚀 Key Features

* **Responsive Design & Dark Mode:** A polished UI tailored for collectors.
* **Dynamic Filtering:** Instant sorting and search capabilities within the catalog.
* **State Management:** Powered by **RxJS** for real-time synchronization of cart and authentication states.
* **Stripe Integration:** Secure payment processing with client-side intent handling.
* **User Dashboard:** Order history and profile management.

---

## 🛠 Tech Stack

* **Framework:** Angular (Latest Stable)
* **Language:** TypeScript
* **Styling:** SCSS (Sass) / HTML5
* **Http Client:** RxJS (Observables)
* **Payment:** Stripe.js / Ngx-Stripe

---

## 💻 Installation & Setup

This project requires [Node.js](https://nodejs.org/) and [Angular CLI](https://angular.io/cli).

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/0xAdafang/Stacked_Deck_Client.git](https://github.com/0xAdafang/Stacked_Deck_Client.git)
    cd Stacked_Deck_Client
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    ng serve
    ```
    The application will be available at `http://localhost:4200/`.

---

## ⚙️ Configuration

Environment variables (API URL, Stripe Public Key) are managed in the `src/environments/` folder.

* `environment.ts` (Development)
* `environment.prod.ts` (Production)

Example:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  stripePublicKey: 'pk_test_...'
};

<hr>
<p><em>Made by <a href="https://github.com/0xAdafang">0xAdafang</a></em></p>
