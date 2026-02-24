import { redirect } from 'next/navigation';
import { AdminLoginForm } from './AdminLoginForm';

export default function AdminLoginPage() {
  if (process.env.DISABLE_ADMIN_AUTH === 'true') {
    redirect('/admin');
  }
  return <AdminLoginForm />;
}
