import { createPortal } from 'react-dom';
import type { ReactNode } from 'react';

interface ModalPortalProps {
  children: ReactNode;
}

export function ModalPortal({ children }: ModalPortalProps) {
  return createPortal(children, document.body);
}
