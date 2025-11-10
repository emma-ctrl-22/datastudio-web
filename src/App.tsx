import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { PermissionRoute } from './routes/PermissionRoute'
import DefaultLayout from './layouts/DefaultLayout'
import { CategoryListPage } from './pages/inventory/CategoryListPage'
import { ProductListPage } from './pages/inventory/ProductListPage'
import { ProductFormPage } from './pages/inventory/ProductFormPage'
import { StockBalancePage } from './pages/stock/StockBalancePage'
import { StockMovementPage } from './pages/stock/StockMovementPage'
import { LowStockAlertsPage } from './pages/stock/LowStockAlertsPage'
import { SupplierListPage } from './pages/purchasing/SupplierListPage'
import { SupplierFormPage } from './pages/purchasing/SupplierFormPage'
import { PurchaseOrderListPage } from './pages/purchasing/PurchaseOrderListPage'
import { PurchaseOrderPage } from './pages/purchasing/PurchaseOrderPage'
import { GoodsReceiptPage } from './pages/purchasing/GoodsReceiptPage'
import { DispatchOrderListPage } from './pages/dispatch/DispatchOrderListPage'
import { DispatchOrderPage } from './pages/dispatch/DispatchOrderPage'
import { PurchaseHistoryReportPage } from './pages/reports/PurchaseHistoryReportPage'
import { DispatchHistoryReportPage } from './pages/reports/DispatchHistoryReportPage'
import { FastMovingItemsReportPage } from './pages/reports/FastMovingItemsReportPage'
import { SlowMovingItemsReportPage } from './pages/reports/SlowMovingItemsReportPage'
import { UserManagementPage } from './pages/admin/UserManagementPage'
import { RoleManagementPage } from './pages/admin/RoleManagementPage'
import { SupplierDetailPage } from './pages/purchasing/SupplierDetailPage'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DefaultLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route
          path="categories"
          element={
            <PermissionRoute resource="products" action="read">
              <CategoryListPage />
            </PermissionRoute>
          }
        />
        <Route
          path="products"
          element={
            <PermissionRoute resource="products" action="read">
              <ProductListPage />
            </PermissionRoute>
          }
        />
        <Route
          path="products/new"
          element={
            <PermissionRoute resource="products" action="create">
              <ProductFormPage />
            </PermissionRoute>
          }
        />
        <Route
          path="products/:id/edit"
          element={
            <PermissionRoute resource="products" action="update">
              <ProductFormPage />
            </PermissionRoute>
          }
        />
        <Route
          path="stock/balances"
          element={
            <PermissionRoute resource="products" action="read">
              <StockBalancePage />
            </PermissionRoute>
          }
        />
        <Route
          path="stock/movements"
          element={
            <PermissionRoute resource="products" action="read">
              <StockMovementPage />
            </PermissionRoute>
          }
        />
        <Route
          path="stock/reorder"
          element={
            <PermissionRoute resource="products" action="read">
              <LowStockAlertsPage />
            </PermissionRoute>
          }
        />
        <Route
          path="suppliers"
          element={
            <PermissionRoute resource="suppliers" action="read">
              <SupplierListPage />
            </PermissionRoute>
          }
        />
        <Route
          path="suppliers/new"
          element={
            <PermissionRoute resource="suppliers" action="create">
              <SupplierFormPage />
            </PermissionRoute>
          }
        />
        <Route
          path="suppliers/:id/edit"
          element={
            <PermissionRoute resource="suppliers" action="update">
              <SupplierFormPage />
            </PermissionRoute>
          }
        />
        <Route
          path="suppliers/:id"
          element={
            <PermissionRoute resource="suppliers" action="read">
              <SupplierDetailPage />
            </PermissionRoute>
          }
        />
        <Route
          path="po"
          element={
            <PermissionRoute resource="purchase_orders" action="read">
              <PurchaseOrderListPage />
            </PermissionRoute>
          }
        />
        <Route
          path="po/new"
          element={
            <PermissionRoute resource="purchase_orders" action="create">
              <PurchaseOrderPage />
            </PermissionRoute>
          }
        />
        <Route
          path="po/:id"
          element={
            <PermissionRoute resource="purchase_orders" action="read">
              <PurchaseOrderPage />
            </PermissionRoute>
          }
        />
        <Route
          path="po/:id/receive"
          element={
            <PermissionRoute resource="purchase_orders" action="update">
              <GoodsReceiptPage />
            </PermissionRoute>
          }
        />
        <Route
          path="dispatch"
          element={
            <PermissionRoute resource="dispatches" action="read">
              <DispatchOrderListPage />
            </PermissionRoute>
          }
        />
        <Route
          path="dispatch/new"
          element={
            <PermissionRoute resource="dispatches" action="create">
              <DispatchOrderPage />
            </PermissionRoute>
          }
        />
        <Route
          path="dispatch/:id"
          element={
            <PermissionRoute resource="dispatches" action="read">
              <DispatchOrderPage />
            </PermissionRoute>
          }
        />
        <Route
          path="dispatch/:id/edit"
          element={
            <PermissionRoute resource="dispatches" action="update">
              <DispatchOrderPage />
            </PermissionRoute>
          }
        />
        <Route
          path="reports/purchase-history"
          element={
            <PermissionRoute resource="reports" action="read">
              <PurchaseHistoryReportPage />
            </PermissionRoute>
          }
        />
        <Route
          path="reports/dispatch-history"
          element={
            <PermissionRoute resource="reports" action="read">
              <DispatchHistoryReportPage />
            </PermissionRoute>
          }
        />
        <Route
          path="reports/fast-movers"
          element={
            <PermissionRoute resource="reports" action="read">
              <FastMovingItemsReportPage />
            </PermissionRoute>
          }
        />
        <Route
          path="reports/slow-movers"
          element={
            <PermissionRoute resource="reports" action="read">
              <SlowMovingItemsReportPage />
            </PermissionRoute>
          }
        />
        <Route
          path="admin/users"
          element={
            <PermissionRoute resource="users" action="read">
              <UserManagementPage />
            </PermissionRoute>
          }
        />
        <Route
          path="admin/roles"
          element={
            <PermissionRoute resource="roles" action="read">
              <RoleManagementPage />
            </PermissionRoute>
          }
        />
        <Route
          path="admin"
          element={
            <PermissionRoute resource="users" action="read">
              <div style={{ padding: 24 }}>
                <h2>Admin Area</h2>
                <p>Requires users:read permission.</p>
              </div>
            </PermissionRoute>
          }
        />
      </Route>
      <Route path="/unauthorized" element={<div style={{ padding: 24 }}>Unauthorized</div>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
