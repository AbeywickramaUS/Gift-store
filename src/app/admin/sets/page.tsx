'use client';

import AdminGate from '@/components/admin/AdminGate';
import CatalogAdmin from '@/components/admin/CatalogAdmin';

export default function AdminSetsPage() {
  return <AdminGate>{(session) => <CatalogAdmin mode="set" accessToken={session.access_token} />}</AdminGate>;
}
