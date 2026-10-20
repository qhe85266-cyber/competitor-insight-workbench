import { AlertCircle, X } from 'lucide-react';

interface Props {
  message: string;
  onRetry?: () => void;
  onClose?: () => void;
}

export function InlineAlert({ message, onRetry, onClose }: Props) {
  return (
    <div className="inline-alert" role="alert">
      <AlertCircle size={16} strokeWidth={2} aria-hidden />
      <span>{message}</span>
      {onRetry ? (
        <button type="button" className="link-btn" onClick={onRetry}>
          重试
        </button>
      ) : null}
      {onClose ? (
        <button type="button" className="toast-close" aria-label="关闭" onClick={onClose}>
          <X size={14} />
        </button>
      ) : null}
    </div>
  );
}
