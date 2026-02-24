'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { GripVertical, Pencil, Plus, Trash2, X } from 'lucide-react';
import type { PageSection, PageSectionType } from '@/lib/types';
import { SectionRenderer } from '@/components/sections';
import { savePageSections } from '@/app/admin/actions/page-sections';

function createDefaultSection(
  type: PageSectionType,
  order: number
): PageSection {
  const id = crypto.randomUUID();
  const base = { id, type, order };
  switch (type) {
    case 'hero':
      return { ...base, title: 'Welcome', subtitle: '' };
    case 'text':
      return { ...base, heading: '', body: '' };
    case 'linkGrid':
      return { ...base, title: 'Links', links: [{ label: 'Example', href: '/' }] };
    case 'spacer':
      return { ...base, height: 'md' };
    default:
      return { ...base, title: '', subtitle: '' };
  }
}

export function CustomizeHomePage({
  initialSections,
}: {
  initialSections: PageSection[];
}) {
  const [sections, setSections] = useState<PageSection[]>(initialSections);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const [exitingId, setExitingId] = useState<string | null>(null);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const reorder = useCallback((fromId: string, toId: string) => {
    setSections((prev) => {
      const fromIdx = prev.findIndex((s) => s.id === fromId);
      const toIdx = prev.findIndex((s) => s.id === toId);
      if (fromIdx === -1 || toIdx === -1) return prev;
      const next = [...prev];
      const [item] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, item);
      return next.map((s, i) => ({ ...s, order: i }));
    });
  }, []);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDragId(id);
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };
  const handleDragOver = (e: React.DragEvent, toId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDropTargetId(toId);
  };
  const handleDrop = (e: React.DragEvent, toId: string) => {
    e.preventDefault();
    setDropTargetId(null);
    const fromId = e.dataTransfer.getData('text/plain');
    if (fromId && fromId !== toId) reorder(fromId, toId);
    setDragId(null);
  };
  const clearDrag = () => {
    setDragId(null);
    setDropTargetId(null);
  };

  const removeSection = (id: string) => {
    if (!confirm('Remove this section?')) return;
    setExitingId(id);
    setTimeout(() => {
      setSections((prev) => prev.filter((s) => s.id !== id).map((s, i) => ({ ...s, order: i })));
      setExitingId(null);
    }, 200);
  };

  const updateSection = (id: string, updates: Partial<PageSection>) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
    setEditingId(null);
  };

  const addSection = (type: PageSectionType) => {
    const newSection = createDefaultSection(type, sections.length);
    setSections((prev) => [...prev, newSection]);
    setAddedIds((prev) => new Set(prev).add(newSection.id));
    setTimeout(() => setAddedIds((prev) => {
      const next = new Set(prev);
      next.delete(newSection.id);
      return next;
    }), 400);
    setAdding(false);
  };

  const saveAll = async () => {
    setSaving(true);
    await savePageSections('home', sections);
    setSaving(false);
  };

  const sectionToEdit = editingId ? sections.find((s) => s.id === editingId) : null;

  return (
    <div className="p-6 pb-24">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="text-sm text-muted hover:text-[var(--foreground)]"
          >
            ← Dashboard
          </Link>
          <span className="text-muted">|</span>
          <h1 className="text-xl font-bold text-[var(--foreground)]">
            Customize Homepage
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
          >
            View site
          </Link>
          <button
            type="button"
            onClick={() => setEditMode((v) => !v)}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
              editMode
                ? 'border-[var(--accent)] bg-[var(--surface-hover)] text-[var(--foreground)]'
                : 'border-border text-muted hover:bg-[var(--surface-hover)]'
            }`}
          >
            {editMode ? 'Done' : 'Customize'}
          </button>
          {editMode && (
            <button
              type="button"
              onClick={saveAll}
              disabled={saving}
              className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--background)] hover:bg-[var(--accent-hover)] disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          )}
        </div>
      </div>

      <p className="mb-8 text-sm text-muted">
        Turn on Customize to add, remove, reorder, or edit sections. Like arranging your iPhone home screen.
      </p>

      <div className="mx-auto max-w-5xl rounded-xl border border-border bg-[var(--background)] p-4 sm:p-6">
        {sections.length === 0 && !editMode && (
          <p className="py-12 text-center text-muted">
            No sections yet. Turn on Customize and add sections.
          </p>
        )}
        {sections.map((section) => (
          <div
            key={section.id}
            draggable={editMode}
            onDragStart={(e) => handleDragStart(e, section.id)}
            onDragOver={(e) => handleDragOver(e, section.id)}
            onDrop={(e) => handleDrop(e, section.id)}
            onDragEnd={clearDrag}
            className={`relative rounded-lg border drag-item ${
              exitingId === section.id ? 'section-exit border-transparent' : ''
            } ${addedIds.has(section.id) ? 'section-enter' : ''} ${editMode ? 'border-dashed border-border hover:border-[var(--accent)]/50' : ''} ${
              dragId === section.id ? 'drag-source' : ''
            } ${dropTargetId === section.id && dragId !== null ? 'drag-drop-target' : ''}`}
          >
            {editMode && (
              <div className={`absolute -left-2 top-4 z-10 flex gap-1 ${exitingId === section.id ? 'pointer-events-none' : ''}`}>
                <span
                  className="cursor-grab touch-none rounded p-1 text-muted hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
                  title="Drag to reorder"
                >
                  <GripVertical className="h-4 w-4" />
                </span>
                <button
                  type="button"
                  onClick={() => setEditingId(section.id)}
                  className="rounded p-1 text-muted hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
                  aria-label="Edit section"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => removeSection(section.id)}
                  className="rounded p-1 text-muted hover:bg-red-500/20 hover:text-red-400"
                  aria-label="Remove section"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
            <div className={editMode ? 'wiggle' : ''}>
              <SectionRenderer section={section} />
            </div>
          </div>
        ))}
      </div>

      {editMode && (
        <div className="fixed bottom-6 right-6">
          {adding ? (
            <div className="rounded-xl border border-border bg-[var(--surface)] p-3 shadow-lg">
              <p className="mb-2 text-xs font-medium text-muted">Add section</p>
              <div className="flex flex-wrap gap-2">
                {(['hero', 'text', 'linkGrid', 'spacer'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => addSection(type)}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-[var(--surface-hover)]"
                  >
                    {type === 'linkGrid' ? 'Link grid' : type}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setAdding(false)}
                className="mt-2 flex items-center gap-1 text-xs text-muted hover:text-[var(--foreground)]"
              >
                <X className="h-3 w-3" /> Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--background)] shadow-lg transition hover:bg-[var(--accent-hover)]"
              aria-label="Add section"
            >
              <Plus className="h-5 w-5" />
            </button>
          )}
        </div>
      )}

      {sectionToEdit && (
        <SectionEditModal
          section={sectionToEdit}
          onSave={(updates) => updateSection(sectionToEdit.id, updates)}
          onClose={() => setEditingId(null)}
        />
      )}
    </div>
  );
}

function SectionEditModal({
  section,
  onSave,
  onClose,
}: {
  section: PageSection;
  onSave: (updates: Partial<PageSection>) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState(section);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-auto rounded-xl border border-border bg-[var(--surface)] p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-4 text-lg font-semibold text-[var(--foreground)]">
          Edit {section.type}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {section.type === 'hero' && (
            <>
              <label className="block text-sm text-muted">Title</label>
              <input
                type="text"
                value={'title' in form ? form.title : ''}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
              />
              <label className="block text-sm text-muted">Subtitle</label>
              <input
                type="text"
                value={'subtitle' in form ? form.subtitle || '' : ''}
                onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
                className="w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
              />
            </>
          )}
          {section.type === 'text' && (
            <>
              <label className="block text-sm text-muted">Heading</label>
              <input
                type="text"
                value={'heading' in form ? form.heading || '' : ''}
                onChange={(e) => setForm((f) => ({ ...f, heading: e.target.value }))}
                className="w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
              />
              <label className="block text-sm text-muted">Body</label>
              <textarea
                rows={4}
                value={'body' in form ? form.body : ''}
                onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                className="w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
              />
            </>
          )}
          {section.type === 'linkGrid' && (
            <>
              <label className="block text-sm text-muted">Title</label>
              <input
                type="text"
                value={'title' in form ? form.title || '' : ''}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
              />
              <label className="block text-sm text-muted">Links (one per line: label | url)</label>
              <textarea
                rows={5}
                value={
                  'links' in form
                    ? form.links?.map((l) => `${l.label} | ${l.href}`).join('\n') || ''
                    : ''
                }
                onChange={(e) => {
                  const links = e.target.value
                    .split('\n')
                    .map((line) => {
                      const parts = line.split('|').map((p) => p.trim());
                      return { label: parts[0] || 'Link', href: parts[1] || '/' };
                    })
                    .filter((l) => l.label);
                  setForm((f) => ({ ...f, links }));
                }}
                placeholder={'Projects | /projects\nBlog | /blog'}
                className="w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
              />
            </>
          )}
          {section.type === 'spacer' && (
            <>
              <label className="block text-sm text-muted">Height</label>
              <select
                value={'height' in form ? form.height : 'md'}
                onChange={(e) =>
                  setForm((f) => ({ ...f, height: e.target.value as 'sm' | 'md' | 'lg' }))
                }
                className="w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
              >
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
              </select>
            </>
          )}
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-[var(--surface-hover)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--background)] hover:bg-[var(--accent-hover)]"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
