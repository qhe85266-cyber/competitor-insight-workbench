import { useEffect } from 'react';
import { Check, AlertCircle, X } from 'lucide-react';

export type ToastKind = 'success' | 'error' | 'neutral' | 'confirm';

export interface ToastState {
  id: number;
  kind: ToastKind;
  message: string;
  confirmLabel?: string;
  onConfirm?: () => void;
}

interface Props {
  toast: ToastState | null;
  onClose: () => void;
}

export function Toast({ toast, onClose }: Props) {
  useEffect(() => {
    if (!toast || toast.kind === 'confirm') return;
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [toast, onClose]);

  if (!toast) return null;

  const Icon = toast.kind === 'success' ? Check : toast.kind === 'error' ? AlertCircle : AlertCircle;

  return (
    <div className={`toast toast-${toast.kind}`} role="status">
      <Icon size={16} strokeWidth={2} aria-hidden />
      <span className="toast-msg">{toast.message}</span>
      {toast.kind === 'confirm' && toast.onConfirm ? (
        <>
          <button type="button" className="btn ghost sm" onClick={onClose}>
            取消
          </button>
          <button
            type="button"
            className="btn primary sm"
            onClick={() => {
              toast.onConfirm?.();
              onClose();
            }}
          >
            {toast.confirmLabel ?? '确定导出'}
          </button>
        </>
      ) : (
        <button type="button" className="toast-close" aria-label="关闭" onClick={onClose}>
          <X size={14} />
        </button>
      )}
    </div>
  );
}
