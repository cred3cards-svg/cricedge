
import dynamic from 'next/dynamic';

const AdminShell = dynamic(() => import('./_client/AdminShell'), {
  loading: () => (
    <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
    </div>
  ),
});

export default function AdminPage() {
  return <AdminShell />;
}
