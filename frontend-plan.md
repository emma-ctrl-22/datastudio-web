# Frontend Development Plan

This document outlines the plan for building the frontend of the Inventory Management System.

## 1. Core Technologies & Libraries

- **Framework:** React with Vite
- **UI Kit:** Ant Design
- **State Management:** Zustand (for global auth state)
- **Data Fetching:** TanStack React Query (for server state)
- **Routing:** React Router
- **Styling:** Tailwind CSS

## 2. Core Components to Build

To maintain consistency and speed up development, we will create a set of shared components.

-   **`SharedTable.tsx`**: A reusable wrapper around Ant Design's `Table` component. It will be configured to accept columns, data, and a render function for an "Actions" column. This function will use the `useAuthStore` and `hasPermission` utility to conditionally render Edit, View, or Delete buttons.
-   **`PageHeader.tsx`**: A component to display the page title and a "Create New" button. The button will also be permission-controlled.
-   **Forms**: We will create standardized forms using Ant Design's `Form` component for creating and editing resources.

## 3. Screen Implementation Plan

We will create a page for each major feature. The navigation links in `DefaultLayout.tsx` will be updated as we build these pages.

### Module 1: Dashboard
-   **File:** `src/pages/Dashboard.tsx`
-   **Task:** Enhance the existing page to fetch and display the key metrics from the `/api/reports/dashboard-summary` endpoint using cards and stats from Ant Design.

### Module 2: Inventory
-   **Products:**
    -   **File:** `src/pages/inventory/ProductListPage.tsx`
    -   **Route:** `/products`
    -   **Features:** Display products in `SharedTable`. Include search and filtering. Actions column with "View/Edit" buttons.
-   **Product Form:**
    -   **File:** `src/pages/inventory/ProductFormPage.tsx`
    -   **Route:** `/products/new` & `/products/:id/edit`
    -   **Features:** A form to create and update products.
-   **Categories:**
    -   **File:** `src/pages/inventory/CategoryListPage.tsx`
    -   **Route:** `/categories`
    -   **Features:** Display categories in `SharedTable` with actions.

### Module 3: Purchasing
-   **Suppliers:**
    -   **File:** `src/pages/purchasing/SupplierListPage.tsx`
    -   **Route:** `/suppliers`
    -   **Features:** `SharedTable` for listing suppliers.
-   **Purchase Orders (POs):**
    -   **File:** `src/pages/purchasing/PurchaseOrderListPage.tsx`
    -   **Route:** `/purchase-orders`
    -   **Features:** `SharedTable` listing all POs. Actions to "View" or "Receive Goods".
-   **Purchase Order Detail/Form:**
    -   **File:** `src/pages/purchasing/PurchaseOrderPage.tsx`
    -   **Route:** `/purchase-orders/new` & `/purchase-orders/:id`
    -   **Features:** A detailed view of a PO, including its lines. This will be the most complex form, allowing users to add/edit products and quantities.

### Module 4: Dispatch
-   **Dispatch Orders:**
    -   **File:** `src/pages/dispatch/DispatchOrderListPage.tsx`
    -   **Route:** `/dispatch-orders`
    -   **Features:** `SharedTable` listing all dispatch orders.
-   **Dispatch Order Detail/Form:**
    -   **File:** `src/pages/dispatch/DispatchOrderPage.tsx`
    -   **Route:** `/dispatch-orders/new` & `/dispatch-orders/:id`
    -   **Features:** Form to create new dispatches, specifying recipient and items.

### Module 5: Reporting
-   **Files:** Create individual pages under `src/pages/reports/` (e.g., `PurchaseHistoryReport.tsx`).
-   **Features:** Each page will display the relevant report data in a table and include an "Export to CSV" button that triggers the `?format=csv` API call.

### Module 6: Administration
-   **Users:**
    -   **File:** `src/pages/admin/UserListPage.tsx`
    -   **Route:** `/admin/users`
    -   **Features:** `SharedTable` to list all users. Actions to edit roles or deactivate users.

## 4. Permissions & Navigation

The `DefaultLayout.tsx` already has a permission-driven menu. We will use the following resource names (from `Permission.ts`) to control access:

-   `dashboard`
-   `products`
-   `suppliers`
-   `purchase_orders`
-   `dispatch_orders`
-   `reports`
-   `users`
