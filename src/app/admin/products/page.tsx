'use client';

import AdminGate from '@/components/admin/AdminGate';
import CatalogAdmin from '@/components/admin/CatalogAdmin';

export default function AdminProductsPage() {
  return <AdminGate>{(session) => <CatalogAdmin mode="product" accessToken={session.access_token} />}</AdminGate>;
}
