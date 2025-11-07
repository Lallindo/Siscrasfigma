# Informações de Login - SisCras

## Administradores

Os administradores têm acesso à gestão de técnicos do seu CRAS.

### Credenciais de Administradores:

| CRAS | Usuário | Senha |
|------|---------|-------|
| Dona Tita | admin.donatita | admin123 |
| Pedro Ometto | admin.pedroometto | admin123 |
| Cila Bauab | admin.cilabauab | admin123 |
| Altos da Cidade | admin.altos | admin123 |
| Central | admin.central | admin123 |
| Distrito de Potunduva | admin.potunduva | admin123 |

## Técnicos

Os técnicos têm acesso ao cadastramento e visualização de famílias.

### Credenciais de Técnicos:

| CRAS | Usuário | Senha |
|------|---------|-------|
| Dona Tita | tecnico.donatita | 123456 |
| Pedro Ometto | tecnico.pedroometto | 123456 |
| Cila Bauab | tecnico.cilabauab | 123456 |
| Altos da Cidade | tecnico.altos | 123456 |
| Central | tecnico.central | 123456 |
| Distrito de Potunduva | tecnico.potunduva | 123456 |

## Funcionalidades por Perfil

### Administrador:
- ✅ Cadastrar novos técnicos no seu CRAS
- ✅ Visualizar lista de técnicos do seu CRAS
- ✅ Remover técnicos (com confirmação de senha do técnico)
- ✅ Todas as funcionalidades de técnico

### Técnico:
- ✅ Cadastrar novas famílias
- ✅ Editar famílias do seu CRAS
- ✅ Visualizar famílias de todos os CRAS (somente leitura)
- ✅ Buscar por famílias
- ✅ Transferir famílias para seu CRAS

## Notas Importantes

1. **Gerenciamento de Técnicos**: Para remover um técnico, o administrador precisa inserir a senha do técnico que está sendo removido. Isso garante que a remoção seja confirmada pelo próprio técnico.

2. **Vinculação ao CRAS**: Cada administrador só pode gerenciar técnicos do seu próprio CRAS. Técnicos adicionados são automaticamente vinculados ao CRAS do administrador.

3. **Botão "Técnicos"**: Este botão aparece no header apenas para usuários administradores, ao lado do botão "Configurações".

4. **Dados Armazenados**: Todos os dados (técnicos e famílias) são armazenados localmente no navegador usando localStorage.
