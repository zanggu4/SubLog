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
  cancelLabel?: string;
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
  cancelLabel = "Cancel",
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
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 m-0 rounded-xl border border-border bg-card text-foreground p-0 backdrop:bg-black/50 max-w-md w-[calc(100%-2rem)]"
    >
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <div className={hideFooter ? "" : "mb-6"}>{children}</div>
        {!hideFooter && (
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={onClose}>
              {cancelLabel}
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
