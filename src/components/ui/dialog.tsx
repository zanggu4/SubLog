"use client";

import { useRef, useEffect, ReactNode } from "react";
import { Button } from "./button";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  onConfirm?: () => void;
  confirmLabel?: string;
  confirmVariant?: "primary" | "danger";
  hideFooter?: boolean;
}

export function Dialog({
  open,
  onClose,
  title,
  children,
  onConfirm,
  confirmLabel = "Confirm",
  confirmVariant = "primary",
  hideFooter = false,
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      className="rounded-xl border border-border bg-card p-0 backdrop:bg-black/50 max-w-md w-full"
    >
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <div className={hideFooter ? "" : "mb-6"}>{children}</div>
        {!hideFooter && (
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            {onConfirm && (
              <Button variant={confirmVariant} onClick={onConfirm}>
                {confirmLabel}
              </Button>
            )}
          </div>
        )}
      </div>
    </dialog>
  );
}
