import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { Family } from '../types/family';

interface TransferMemberDialogProps {
  open: boolean;
  memberName: string;
  currentFamily: Family | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function TransferMemberDialog({
  open,
  memberName,
  currentFamily,
  onConfirm,
  onCancel,
}: TransferMemberDialogProps) {
  const responsavel = currentFamily?.membros.find(m => m.isResponsavel && m.ativo);

  return (
    <AlertDialog open={open} onOpenChange={onCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Membro já cadastrado em outra família</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              O membro <strong>{memberName}</strong> já está cadastrado na família com prontuário{' '}
              <strong>{currentFamily?.prontuario}</strong>
              {responsavel && (
                <>
                  {' '}(responsável: <strong>{responsavel.nome}</strong>)
                </>
              )}.
            </p>
            <p className="text-amber-600">
              Deseja transferir este membro para a família atual?
            </p>
            <p className="text-sm text-gray-600">
              O membro será desativado na família anterior e adicionado à família atual.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Confirmar Transferência
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
