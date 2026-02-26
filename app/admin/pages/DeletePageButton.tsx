'use client';

import { useRouter } from 'next/navigation';
import { removeCustomPage } from '@/app/admin/actions/pages';

export function DeletePageButton({ slug }: { slug: string }) {
  const router = useRouter();
  const handleDelete = async () => {
    if (!confirm('Remove this page? Nav links pointing to it will break.')) return;
    await removeCustomPage(slug);
    router.refresh();
  };
  return (
    <button
      type="button"
      onClick={handleDelete}
      className="text-red-400 hover:text-red-300 hover:underline"
    >
      Delete
    </button>
  );
}
