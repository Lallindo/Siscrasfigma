import { ReactNode } from 'react';

interface ReadOnlyWrapperProps {
  readOnly: boolean;
  children: ReactNode;
}

export function ReadOnlyWrapper({ readOnly, children }: ReadOnlyWrapperProps) {
  if (!readOnly) return <>{children}</>;
  
  return (
    <div className="pointer-events-none opacity-70">
      {children}
    </div>
  );
}
