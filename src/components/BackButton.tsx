import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';

interface BackButtonProps {
  onClick: () => void;
}

export function BackButton({ onClick }: BackButtonProps) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className="gap-2"
    >
      <ArrowLeft className="w-4 h-4" />
      Voltar
    </Button>
  );
}
