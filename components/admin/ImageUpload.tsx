'use client';

import { useState } from 'react';

type Props = {
  value: string[];
  onChange: (urls: string[]) => void;
  multiple?: boolean;
};

export function ImageUpload({ value, onChange, multiple = true }: Props) {
  const [uploading, setUploading] = useState(false);

  async function onFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('file', files[i]);
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (res.ok && data.url) urls.push(data.url);
      }
      onChange(multiple ? [...value, ...urls] : urls.length ? [urls[0]] : []);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  function remove(url: string) {
    onChange(value.filter((u) => u !== url));
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {value.map((url) => (
          <div key={url} className="relative group">
            <img
              src={url}
              alt=""
              className="h-20 w-20 rounded-lg border border-border object-cover"
            />
            <button
              type="button"
              onClick={() => remove(url)}
              className="absolute -right-1 -top-1 rounded-full bg-red-500 p-0.5 text-white opacity-0 transition group-hover:opacity-100"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <label className="inline-block cursor-pointer rounded-lg border border-border bg-surface-hover px-3 py-2 text-sm hover:bg-border">
        {uploading ? 'Uploading…' : 'Add image'}
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={onFileSelect}
          className="hidden"
          disabled={uploading}
        />
      </label>
    </div>
  );
}
