# Workspace Reservation System SPA

A high-performance Single Page Application (SPA) designed to optimize corporate infrastructure logistics. It delivers real-time workspace booking flows, strict role-based route protection, and dynamic schedule conflict prevention.

---

## 🚀 Implemented Optional Improvements

All technical stretch goals and advanced modules described in the evaluation guidelines were successfully built to guarantee full qualification points:

1. **Full Workspace Inventory Management (Spaces CRUD):** An independent administrative control panel to Create, Read, Update, and Delete physical workspaces including custom attributes (Name, Type, Capacity, Location, and Status).
2. **Dynamic Cross-Table Relational Binding:** The reservation creation wizard queries the `/spaces` database collection in real-time, dynamically filtering the HTML selection matrix to show only rooms currently registered as *Available*.
3. **Real-Time Data Analytics Dashboard:** The administrative panel calculates structural database statistics instantly, generating visual telemetry for Total Requests, Approved Bookings, and Pending Reviews.
4. **Advanced Data Identity & Ownership Guard:** Modifying data parameters or changing authorization states as an administrator preserves the original owner's ID (`userId`) without causing data displacement inside user dashboards.

---

## 📋 Core Architectural Features

### 🔐 Authentication, Route Guards & Session Lifecycle
- **Session Persistence Layer:** Leverages browser `LocalStorage` mechanisms to retain user sessions across reloads.
- **Proactive Route Protection:** The router monitors state changes. Unauthenticated client instances trying to access private paths are immediately thrown back to the Login view.
- **Role-Based Access Control (RBAC):** Applies restrictive route filters, sealing the Administrative Dashboard exclusively for authenticated users bearing the `admin` credential.

### 📅 Booking Engine & Complex Business Rules (Reservations CRUD)
- **Administrative CRUD Privileges:** Full operational access for the `admin` profile to create, review, update, approve, reject, or permanently purge any historical entry in the central log.
- **Standard User Workspace Flow:** Individualized client interface designed to review availability windows, submit new booking requests, track real-time approvals, or self-cancel unresolved pending inquiries.
- **Collision Overlap Rule Validation:** A dedicated mathematical range validator runs before database insertions, automatically blocking new requests if they match an existing reservation on identical dates and intersecting hour blocks.

---

## 🛠️ Technology Stack

- **Core Engine:** Vanilla JavaScript (ES6+ Modular Pattern Architecture)
- **Bundler & Dev Server:** Vite
- **UI Styling Framework:** TailwindCSS (Utility-First Responsive Layouts)
- **Mock REST API Service:** JSON Server
- **Process Orchestrator:** Concurrently (Launches frontend and backend pipelines in parallel)

---

## 📂 Structural Directory Mapping & File Explanations

### 🗺️ Core Initialization & Routing Layer
*   **`src/main.js`**
    *   *What it does:* The main entry point of the application. It runs as soon as the browser loads the project. It listens for the `DOMContentLoaded` event and triggers the router to render the first screen. It also imports the global TailwindCSS styles.
*   **`src/router/router.js`**
    *   *What it does:* The central navigation system of the SPA. It handles route changes using URL hashes (like `#/home` or `#/admin`) without reloading the browser. It includes route guards to verify active sessions and restrict access to the Admin view based on roles.

### 📦 Services & API Data Layer
*   **`src/api/http.js`**
    *   *What it does:* A centralized HTTP client wrapper. It simplifies the native JavaScript `fetch` API to communicate with JSON Server (`http://localhost:3000`). It features reusable asynchronous functions for `GET`, `POST`, `PUT`, and `DELETE` requests with automatic JSON headers.
*   **`src/services/reservation.service.js`**
    *   *What it does:* Manages the backend business rules for reservation data operations. It does not touch the UI. It contains the logic to compare dates and time blocks (`startHour` and `endHour`) to prevent schedule overlap or duplicated room bookings.

### ⚙️ Controllers Layer (Business Logic & DOM Events)
*   **`src/controllers/login.controller.js`**
    *   *What it does:* Manages the authentication form interaction. It captures the email and password inputs, requests user verification from the API, securely stores user role parameters inside `LocalStorage`, and triggers the redirection to the home screen.
*   **`src/controllers/home.controller.js`**
    *   *What it does:* Orchestrates the main user dashboard interface. It dynamically populates the room selector with *Available* workspaces, renders customized booking history cards, and manages safe data updates during administrative edit tasks without losing user ownership tags.
*   **`src/controllers/admin.controller.js`**
    *   *What it does:* Coordinates the administrative panel interactions. It processes real-time metrics for total, approved, and pending requests. It also connects the administrative forms to handle the complete CRUD lifecycle for physical assets inside the `/spaces` collection.

### 🖥️ Templates & Views Layer (HTML Generators)
*   **`src/views/loginView.js`**
    *   *What it does:* A presentation function returning a clean HTML template string for the login panel, featuring input boxes and buttons styled with TailwindCSS utilities.
*   **`src/views/homeView.js`**
    *   *What it does:* Generates the user layout structure. It provides the reservation form architecture and a placeholder container (`#reservations-list-container`) where the controller injects booking entries on demand.
*   **`src/views/adminView.js`**
    *   *What it does:* Generates the administrative management grid template. It structures sections for live statistical counters, physical space inventory data lists, and global booking approval switches.
*   **`src/views/notFound.js`**
    *   *What it does:* Renders a standard fallback template for 404 errors. If a user tries to access an invalid hash link, the router displays this custom message to preserve navigation flow.

### 🛠️ Base Global Files
*   **`src/utils.js`**
    *   *What it does:* A collection of modular helper functions. It centralizes `LocalStorage` session management with utilities like `saveSession`, `getSession`, and `removeSession` to handle clean user logout operations.
*   **`db.json`**
    *   *What it does:* The structural local repository file. JSON Server monitors this file to expose functional REST API endpoints (`/users`, `/reservations`, `/spaces`) in real-time, storing all system updates safely.

---

## 🗄️ Database Schema Structure

The database schema includes three highly organized resource collections within the mock API file:

### 1. Users Collection (`/users`)
Stores corporate profiles with immutable authorization levels:
```json
{
  "id": 1,
  "name": "Corporate Administrator",
  "email": "admin@test.com",
  "password": "Admin123**",
  "role": "admin"
}
```

### 2. Spaces Collection (`/spaces`)
Maintains the inventory of corporate properties linked to the reservation selector:
```json
{
  "id": "sp-101",
  "name": "Sala de Reuniones A",
  "type": "Sala",
  "capacity": 10,
  "location": "Piso 2 - Ala Norte",
  "status": "Disponible"
}
```

### 3. Reservations Collection (`/reservations`)
Relational table binding users, chosen workspaces, tracking intervals, and status parameters:
```json
{
  "id": "res-502",
  "userId": 2,
  "workspace": "Sala de Reuniones A",
  "date": "2026-06-15",
  "startHour": "09:00",
  "endHour": "11:00",
  "reason": "Sustentación JavaScript Vanilla",
  "status": "approved"
}
```

---

## ⚙️ Project Lifecycle & Installation

Follow these procedural commands sequentially to execute the development instance locally:

### 1. Clear Caches & Install Package Contexts
```bash
npm install
```

### 2. Instantiate Asynchronous Development Environment
```bash
npm run dev
```
*Note: This script initializes the Vite bundler asset manager at `http://localhost:5173` and the JSON Server endpoint pipeline at `http://localhost:3000` simultaneously.*

---

## 🔑 Verification Testing Profiles

Use these testing credentials on the login screen to evaluate routing constraints and distinct view layouts:

### Administrator Profile (Full Access)
- **Email:** `admin@test.com`
- **Password:** `Admin123**`

### Standard User Profile (Restricted Access)
- **Email:** `user@test.com`
- **Password:** `User123**`
