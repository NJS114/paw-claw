import { useEffect, useRef, type ReactNode } from 'react';

export function GameDialog({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current!;
    const trigger = document.activeElement as HTMLElement | null;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    dialog.querySelector<HTMLElement>('button, input, select')?.focus();
    const back = () => { const dialogs = document.querySelectorAll('dialog[open]'); if (dialogs[dialogs.length - 1] === dialog) onClose(); };
    window.addEventListener('paw-back', back);
    return () => { window.removeEventListener('paw-back', back); document.body.style.overflow = previous; trigger?.focus(); };
  }, []);
  return <dialog ref={ref} className="royal-dialog" aria-label={title} onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === event.currentTarget) onClose(); }} onKeyDown={event => {
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); onClose(); }
    if (event.key === 'Tab') {
      const controls = Array.from(ref.current!.querySelectorAll<HTMLElement>('button:not(:disabled), input, select, a[href]'));
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
  }}><div className="royal-dialog-heading"><h2>{title}</h2><button onClick={onClose} aria-label="Fermer">×</button></div>{children}</dialog>;
}
