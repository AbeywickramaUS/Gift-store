'use client';

import AdminGate from '@/components/admin/AdminGate';
import OrdersDashboard from '@/components/admin/OrdersDashboard';

export default function AdminOrdersPage() {
  return <AdminGate>{(session) => <OrdersDashboard accessToken={session.access_token} />}</AdminGate>;
}
