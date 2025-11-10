# Frontend Requirements Checklist

Use this document to track the implementation progress of the frontend UI and components.

## 1. Core Infrastructure & Shared Components
- [x] **`SharedTable.tsx`**: Generic, typed table component for displaying data lists.
- [x] **`PageHeader.tsx`**: Standardized header for pages with action buttons.
- [x] **API Services**: Create TanStack Query hooks for all backend entities (Products, Suppliers, POs, etc.).
- [x] **Forms**: Standardized, reusable form components for create/edit operations.

## 2. Main Dashboard
- [x] **Dashboard Page**: Fetch and display key metrics from the dashboard summary endpoint.

## 3. Item & Category Management
- [x] **Product List Page**: View, search, and filter products in a table.
- [x] **Product Form Page**: Create and edit products.
- [x] **Category List Page**: View, create, and edit categories.

## 4. Stock Tracking & Control
- [x] **Stock Balance Page**: Display real-time stock levels for all items.
- [x] **Stock Movement Page**: Show a ledger of all historical stock movements.
- [x] **Low Stock Alerts Page**: List all items currently below their reorder level.

## 5. Supplier & Purchase Management
- [x] **Supplier List Page**: View, create, and edit suppliers.
- [x] **Purchase Order (PO) List Page**: View, search, and filter all POs.
- [x] **PO Create/View Page**: A detailed page to create a new PO or view an existing one with its lines.
- [x] **Goods Receipt (GRN) Flow**: A modal or page (launched from the PO view) to record the receipt of goods against a PO.

## 6. Dispatch & Usage Management
- [x] **Dispatch Order List Page**: View, search, and filter all dispatch orders.
- [x] **Dispatch Order Create/View Page**: A page to create a new dispatch order or view an existing one.

## 7. Reporting & Analytics
- [x] **Purchase History Report**: Display purchase history with filters and CSV export.
- [x] **Dispatch History Report**: Display dispatch history with filters and CSV export.
- [x] **Movers Reports**: Pages for fast- and slow-moving items.

## 8. Administration
- [x] **User Management Page**: List users, with actions to edit roles and status.
