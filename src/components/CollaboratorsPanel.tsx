import { useState } from 'react';
import { Collaborator, CollaboratorRole } from '@/types/collaborator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, UserPlus, MoreVertical, Crown, Edit, Eye, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getCurrentUserId } from '@/lib/collaboratorStorage';

interface CollaboratorsPanelProps {
  collaborators: Collaborator[];
  currentUserId: string;
  isAdmin: boolean;
  onAdd: (name: string, email: string, role: CollaboratorRole) => void;
  onUpdate: (id: string, updates: Partial<Collaborator>) => void;
  onRemove: (id: string) => void;
}

const roleConfig: Record<CollaboratorRole, { label: string; icon: typeof Crown; color: string }> = {
  admin: { label: 'Administrador', icon: Crown, color: 'text-yellow-600 dark:text-yellow-400' },
  editor: { label: 'Editor', icon: Edit, color: 'text-blue-600 dark:text-blue-400' },
  viewer: { label: 'Solo lectura', icon: Eye, color: 'text-gray-600 dark:text-gray-400' },
};

export const CollaboratorsPanel = ({
  collaborators,
  currentUserId,
  isAdmin,
  onAdd,
  onUpdate,
  onRemove,
}: CollaboratorsPanelProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<CollaboratorRole>('editor');
  const [error, setError] = useState('');

  const handleAdd = () => {
    if (!newName.trim() || !newEmail.trim()) {
      setError('Nombre y email son requeridos');
      return;
    }

    if (!newEmail.includes('@')) {
      setError('Email inválido');
      return;
    }

    try {
      onAdd(newName.trim(), newEmail.trim(), newRole);
      setNewName('');
      setNewEmail('');
      setNewRole('editor');
      setError('');
      setIsDialogOpen(false);
    } catch (err: any) {
      setError(err.message || 'Error al agregar colaborador');
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const otherCollaborators = collaborators.filter(c => c.id !== currentUserId);
  const currentUser = collaborators.find(c => c.id === currentUserId);

  return (
    <div className="border-t border-sidebar-border pt-2 mt-2">
      <div className="px-2 mb-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>Colaboradores</span>
            <span className="text-xs opacity-60">({collaborators.length})</span>
          </div>
          {isAdmin && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                >
                  <UserPlus className="w-3 h-3" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invitar colaborador</DialogTitle>
                  <DialogDescription>
                    Agrega un nuevo miembro a tu espacio de trabajo
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nombre</label>
                    <Input
                      placeholder="Juan Pérez"
                      value={newName}
                      onChange={(e) => {
                        setNewName(e.target.value);
                        setError('');
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      placeholder="juan@ejemplo.com"
                      value={newEmail}
                      onChange={(e) => {
                        setNewEmail(e.target.value);
                        setError('');
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Rol</label>
                    <Select
                      value={newRole}
                      onValueChange={(value) => setNewRole(value as CollaboratorRole)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">
                          <div className="flex items-center gap-2">
                            <Crown className="w-4 h-4 text-yellow-600" />
                            <span>Administrador</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="editor">
                          <div className="flex items-center gap-2">
                            <Edit className="w-4 h-4 text-blue-600" />
                            <span>Editor</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="viewer">
                          <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4 text-gray-600" />
                            <span>Solo lectura</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {error && (
                    <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                      {error}
                    </div>
                  )}
                  <Button onClick={handleAdd} className="w-full">
                    Invitar colaborador
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <div className="space-y-1 max-h-[200px] overflow-y-auto">
        {/* Usuario actual */}
        {currentUser && (
          <motion.div
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-sidebar-accent group"
          >
            <Avatar className="w-6 h-6">
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                {getInitials(currentUser.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium truncate">{currentUser.name}</span>
                {currentUser.role === 'admin' && (
                  <Crown className="w-3 h-3 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                )}
              </div>
              <span className="text-xs text-muted-foreground truncate block">
                {roleConfig[currentUser.role].label}
              </span>
            </div>
          </motion.div>
        )}

        {/* Otros colaboradores */}
        <AnimatePresence>
          {otherCollaborators.map((collaborator) => {
            const RoleIcon = roleConfig[collaborator.role].icon;
            const isCurrentUser = collaborator.id === currentUserId;

            return (
              <motion.div
                key={collaborator.id}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -5 }}
                className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-sidebar-accent group"
              >
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="text-xs bg-accent">
                    {getInitials(collaborator.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium truncate">{collaborator.name}</span>
                    <RoleIcon className={cn('w-3 h-3 flex-shrink-0', roleConfig[collaborator.role].color)} />
                  </div>
                  <span className="text-xs text-muted-foreground truncate block">
                    {collaborator.email}
                  </span>
                </div>
                {isAdmin && !isCurrentUser && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          const newRole: CollaboratorRole = collaborator.role === 'admin' ? 'editor' : 'admin';
                          onUpdate(collaborator.id, { role: newRole });
                        }}
                      >
                        {collaborator.role === 'admin' ? (
                          <>
                            <Edit className="w-4 h-4 mr-2" />
                            Cambiar a Editor
                          </>
                        ) : (
                          <>
                            <Crown className="w-4 h-4 mr-2" />
                            Cambiar a Admin
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          const newRole: CollaboratorRole = collaborator.role === 'viewer' ? 'editor' : 'viewer';
                          onUpdate(collaborator.id, { role: newRole });
                        }}
                      >
                        {collaborator.role === 'viewer' ? (
                          <>
                            <Edit className="w-4 h-4 mr-2" />
                            Cambiar a Editor
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-2" />
                            Cambiar a Solo lectura
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => {
                          if (confirm(`¿Eliminar a ${collaborator.name}?`)) {
                            try {
                              onRemove(collaborator.id);
                            } catch (err: any) {
                              alert(err.message);
                            }
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {otherCollaborators.length === 0 && (
          <div className="px-2 py-4 text-xs text-muted-foreground text-center">
            {isAdmin ? 'No hay colaboradores. Invita a alguien para empezar.' : 'No hay otros colaboradores'}
          </div>
        )}
      </div>
    </div>
  );
};

