'use client';

import { useRouter } from 'next/navigation';
import { setCustomPageActive, setBuiltinPageActive } from '@/app/admin/actions/pages';

type Props =
  | { kind: 'builtin'; path: string; active: boolean }
  | { kind: 'custom'; slug: string; active: boolean };

export function PageActiveToggle(props: Props) {
  const router = useRouter();
  const active = props.kind === 'builtin' ? props.active : (props.active !== false);

  const handleToggle = async () => {
    if (props.kind === 'builtin') {
      await setBuiltinPageActive(props.path, !active);
    } else {
      await setCustomPageActive(props.slug, !active);
    }
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
        active
          ? 'bg-green-500/20 text-green-600 dark:text-green-400'
          : 'bg-muted text-muted'
      }`}
    >
      {active ? 'Active' : 'Inactive'}
    </button>
  );
}
