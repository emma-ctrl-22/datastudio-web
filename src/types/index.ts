export type Permission = { id: string; resource: string; action: string };
export type Role = { id: string; name: string; description?: string | null; };
export type User = { id: string; username: string; email: string; is_active: boolean };

export type AuthResponse = {
  user: User;
  roles: Role[];
  permissions: Permission[];
};

export type Pagination = { page: number; pageSize: number; total: number };

export type UserListItem = Pick<User, 'id' | 'username' | 'email' | 'is_active'> & { roles: Role[] };
export type UserListResponse = Pagination & { items: UserListItem[] };

export type LoginPayload = { usernameOrEmail: string; password: string };
export type SignupPayload = { username: string; email: string; password: string; initialRoleName?: string };
export type CreateUserPayload = {
  username: string;
  email: string;
  password: string;
  roles?: string[];
};
export type ChangePasswordPayload = { oldPassword: string; newPassword: string };
export type UpdateUserPayload = { username?: string; is_active?: boolean };
export type AssignRolePayload = { roleName: string };

export type CreateRolePayload = {
  name: string;
  description?: string;
  permissions?: string[];
};
export type UpdateRolePayload = Partial<CreateRolePayload>;

//-================================================================================================
//? ENTITIES
//================================================================================================

export type Category = {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  is_active: boolean;
  created_at: string;
};

export type Product = {
  id: string;
  product_code: string;
  name: string;
  description?: string | null;
  unit_of_measure: string;
  category?: Category | null;
  reorder_level: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  barcode?: string | null;
  serial_number?: string | null;
  requires_serial_tracking: boolean;
  requires_batch_tracking: boolean;
  requires_expiry_tracking: boolean;
};

export type ProductSupplier = {
  id: string;
  product: Product;
  supplier: Supplier;
  supplier_part_number?: string | null;
  is_primary_supplier: boolean;
  unit_cost?: string | null;
};

export type ProductImage = {
  id: string;
  product_id: string;
  url: string;
  alt_text?: string | null;
};

export type Supplier = {
  id: string;
  supplier_code: string;
  name: string;
  contact_person?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  is_active: boolean;
  created_at: string;
};

export type PurchaseOrderLine = {
  id: string;
  line_number: number;
  product: Product;
  quantity_ordered: number;
  unit_cost: string;
};

export type PurchaseOrder = {
  id: string;
  po_number: string;
  supplier: Supplier;
  order_date: string;
  status: 'draft' | 'sent' | 'part_received' | 'received' | 'cancelled';
  lines: PurchaseOrderLine[];
  notes?: string | null;
  created_at: string;
  updated_at: string;
};

export type DispatchLine = {
  id: string;
  line_number: number;
  product: Product;
  quantity: number;
};

export type DispatchOrder = {
  id: string;
  dispatch_number: string;
  recipient_name: string;
  dispatch_date: string;
  status: 'draft' | 'confirmed' | 'dispatched' | 'delivered' | 'cancelled';
  lines: DispatchLine[];
  notes?: string | null;
  created_at: string;
  updated_at: string;
};

//-================================================================================================
//? API PAYLOADS
//================================================================================================

// Payloads for Product & Category
export type ListProductsParams = {
  page?: number;
  pageSize?: number;
  category_id?: string;
  is_active?: boolean;
  search?: string;
};
export type ProductListResponse = Pagination & { items: Product[] };
export type CreateProductPayload = Omit<Product, 'id' | 'created_at' | 'updated_at' | 'category' | 'product_code'> & {
  category_id?: string;
  initial_supplier_id?: string;
  initial_supplier_part_number?: string;
  initial_unit_cost?: string;
};
export type UpdateProductPayload = Partial<CreateProductPayload>;

export type CategoryListResponse = Category[];
export type CreateCategoryPayload = Omit<Category, 'id' | 'created_at' | 'code'>;
export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;

// Payloads for Supplier
export type SupplierListResponse = Supplier[];
export type CreateSupplierPayload = Omit<Supplier, 'id' | 'created_at'>;
export type UpdateSupplierPayload = Partial<CreateSupplierPayload>;

// Payloads for ProductSupplier
export type LinkProductSupplierPayload = {
  supplier_id: string;
  supplier_part_number?: string;
  is_primary_supplier?: boolean;
  unit_cost?: string;
};

export type UpdateProductSupplierPayload = Partial<LinkProductSupplierPayload>;

// Payloads for ProductImage
export type AddProductImagePayload = {
  url: string;
  alt_text?: string;
};

// Payloads for Purchase Order
export type ListPurchaseOrdersParams = {
  page?: number;
  pageSize?: number;
  supplier_id?: string;
  status?: PurchaseOrder['status'];
  start_date?: string;
  end_date?: string;
};
export type PurchaseOrderListResponse = Pagination & { items: PurchaseOrder[] };
export type CreatePurchaseOrderPayload = {
  po_number: string;
  supplier_id: string;
  order_date: string;
  notes?: string;
  lines: Array<{
    product_id: string;
    quantity_ordered: number;
    unit_cost: string;
  }>;
};
export type UpdatePurchaseOrderPayload = {
  status?: 'draft' | 'sent' | 'part_received' | 'received' | 'cancelled';
  sent_date?: string;
  notes?: string;
};

// Payloads for Dispatch Order
export type ListDispatchOrdersParams = {
  page?: number;
  pageSize?: number;
  status?: DispatchOrder['status'];
  recipient_type?: 'hospital' | 'clinic' | 'customer' | 'internal';
  start_date?: string;
  end_date?: string;
};
export type DispatchOrderListResponse = Pagination & { items: DispatchOrder[] };
export type CreateDispatchOrderPayload = {
  dispatch_number: string;
  recipient_name: string;
  recipient_type?: 'hospital' | 'clinic' | 'customer' | 'internal';
  contact_phone?: string;
  delivery_address?: string;
  dispatch_date: string;
  notes?: string;
  lines: Array<{
    product_id: string;
    quantity: number;
  }>;
};
export type UpdateDispatchOrderPayload = {
  status?: 'draft' | 'confirmed' | 'dispatched' | 'delivered' | 'cancelled';
  recipient_name?: string;
  recipient_type?: 'hospital' | 'clinic' | 'customer' | 'internal';
  contact_phone?: string;
  delivery_address?: string;
  dispatch_date?: string;
  notes?: string;
};


//-================================================================================================
//? GOODS RECEIPT
//================================================================================================

export type GoodsReceiptLine = {
  id: string;
  po_line_id: string;
  product: Product;
  quantity_received: number;
  unit_cost?: string | null;
  batch_number?: string | null;
  serial_number?: string | null;
  expiry_date?: string | null;
};

export type GoodsReceipt = {
  id: string;
  grn_number: string;
  purchase_order: PurchaseOrder;
  received_date: string;
  notes?: string | null;
  receivedBy: User;
  created_at: string;
  lines: GoodsReceiptLine[];
};

export type CreateGoodsReceiptPayload = {
  grn_number: string;
  purchase_order_id: string;
  received_date: string;
  notes?: string;
  lines: Array<{
    po_line_id: string;
    product_id: string;
    quantity_received: number;
    unit_cost?: string;
    batch_number?: string;
    serial_number?: string;
    expiry_date?: string;
  }>;
};


//-================================================================================================
//? STOCK MOVEMENT
//================================================================================================

export type StockMovement = {
  id: string;
  product: Product;
  movement_type: 'in' | 'out' | 'adjustment';
  quantity: number;
  unit_cost?: string | null;
  reference_type?: string | null;
  reference_id?: string | null;
  reference_number?: string | null;
  notes?: string | null;
  performedBy: User;
  transaction_date: string;
};

export type ListStockMovementsParams = {
  page?: number;
  pageSize?: number;
  product_id?: string;
  movement_type?: 'in' | 'out' | 'adjustment';
  reference_type?: string;
  start_date?: string;
  end_date?: string;
};

export type StockMovementListResponse = Pagination & { items: StockMovement[] };


//-================================================================================================
//? REPORTING & DASHBOARD
//================================================================================================

export type StockValuation = {
  total_items: number;
  total_quantity: number;
  total_value: string;
  average_cost: string;
};

export type LowStockProduct = {
  product_id: string;
  product_name: string;
  product_code: string;
  current_quantity: number;
  reorder_level: number;
  primary_supplier_name: string | null;
};

export type OrderStatusSummary = {
  status: string;
  count: number;
};

export type StockMovementSummary = {
  total_in: number;
  total_out: number;
  total_adjustment: number;
};

export type TopSupplier = {
  supplier_id: string;
  supplier_name: string;
  total_po_value: string;
};

export type RecentlyReceivedItem = {
  product_id: string;
  product_name: string;
  quantity_received: number;
  supplier_name: string;
  received_date: string;
};

export type EnhancedDashboardSummary = {
  stock_valuation: StockValuation;
  low_stock_products: LowStockProduct[];
  purchase_order_status_summary: OrderStatusSummary[];
  dispatch_order_status_summary: OrderStatusSummary[];
  stock_movement_summary: StockMovementSummary;
  top_suppliers: TopSupplier[];
  recently_received_items: RecentlyReceivedItem[];
};

export type DashboardSummary = {
  stock_valuation: StockValuation;
  low_stock_items_count: number;
  pending_po_count: number;
  recent_dispatches_count: number;
};

export type PurchaseHistoryItem = {
  id: string;
  po_number: string;
  supplier_name: string;
  purchase_date: string;
  product_name: string;
  quantity: number;
  unit_cost: string;
  total_cost: string;
};

export type ListPurchaseHistoryParams = {
  page?: number;
  pageSize?: number;
  start_date?: string;
  end_date?: string;
  product_id?: string;
  supplier_id?: string;
};

export type PurchaseHistoryListResponse = Pagination & { items: PurchaseHistoryItem[] };

export type DispatchHistoryItem = {
  id: string;
  dispatch_number: string;
  recipient_name: string;
  dispatch_date: string;
  product_name: string;
  quantity: number;
};

export type ListDispatchHistoryParams = {
  page?: number;
  pageSize?: number;
  start_date?: string;
  end_date?: string;
  product_id?: string;
  recipient_type?: string;
};

export type DispatchHistoryListResponse = Pagination & { items: DispatchHistoryItem[] };

export type MoversReportItem = {
  id: string;
  product_id: string;
  product_name: string;
  product_code: string;
  category_name: string;
  total_quantity_moved: number;
};

export type ListMoversReportParams = {
  page?: number;
  pageSize?: number;
  time_window?: '30d' | '90d' | '1y';
};

export type MoversReportListResponse = Pagination & { items: MoversReportItem[] };

export interface LowStockAlert {
  id: string;
  product_id: string;
  product_code: string;
  product_name: string;
  current_quantity: number;
  reorder_level: number;
  shortfall: number;
}

export interface StockBalance {
  id: string;
  product_id: string;
  product_code: string;
  product_name: string;
  current_quantity: number;
  reorder_level: number;
  below_reorder_level: boolean;
  total_value: string;
  average_cost: string;
  last_movement_date: string | null;
}




