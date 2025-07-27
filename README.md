# Academy Device Health Dashboard

This project is a Vue 3 application that displays device health metrics across academies. It features a device table, battery health badge, priority color indicators, and more. The application is styled using Tailwind CSS and includes unit tests for key components.

---

## 🚀 Design Overview

### 🎯 Purpose

The app provides a dashboard to monitor devices used in an academy. Each device has a health status, usage statistics, and can be sorted and visually represented using color-coded badges.

### 🧩 Components

- **DeviceTable.vue**: Displays a list of devices for an academy including serial numbers, battery health, average usage, and reading count.
- **BatteryHealthBadge.vue**: Renders a badge based on battery health status (`healthy`, `unhealthy`, `unknown`).

### 🛠 Assumptions

- Device health statuses are limited to `healthy`, `unhealthy`, and `unknown`.
- Average daily usage over `30%` is considered high (and marked in red).
- Devices are sorted first by health status, then by usage.
- The application is modular and ready to consume real data from an API (currently mock data is used in tests).

---

### 🧪 Running the Application and Tests

### 📦 Install Dependencies

- npm install

### Run the Development Server

- npm run dev

### Run Unit Tests

- npm run test

## 🧪 Project Structure

src/
│
├── components/
│ ├── ui/
│ ├── DeviceTable.vue
│ ├── BatteryHealthBadge.vue
│ ├── SchoolCard.vue
│
├── services/
│ └── BatteryService.ts # Type definitions and mock services
│
├── tests/
│ └── DeviceTable.spec.ts # Unit tests using Vitest + Testing Library
│ ├── BatteryHealthBadge.spec.ts
| ├── SchoolCard.spec.ts
│
├── views/
│ └── Home.vue # Type definitions and mock services
│ └── NotFound.vue
├── App.vue
└── main.ts

## Technologies Used

-- Vue 3 with <script setup>
-- TypeScript
-- Tailwind CSS
-- Vitest
-- @testing-library/vue
-- Lucide Vue Icons

## Author

-- Tunde Siyanbola

```

```
