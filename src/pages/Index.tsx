import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Editor } from '@/components/Editor';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';
import { usePages } from '@/hooks/usePages';
import { useCollaborators } from '@/hooks/useCollaborators';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Index = () => {
  const {
    pages,
    loading,
    createPage,
    updatePage,
    deletePage,
    toggleFavorite,
  } = usePages();

  const {
    collaborators,
    currentUserId,
    isAdmin,
    loading: collaboratorsLoading,
    addCollaborator,
    updateCollaborator,
    removeCollaborator,
  } = useCollaborators();

  const [currentPageId, setCurrentPageId] = useState<string | null>(null);

  const currentPage = pages.find(p => p.id === currentPageId);

  const handleCreatePage = (parentId?: string) => {
    const newPage = createPage('Sin título', parentId || null);
    setCurrentPageId(newPage.id);
  };

  const handlePageSelect = (id: string) => {
    setCurrentPageId(id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Auto-select first page if none selected and pages exist
  if (!currentPageId && pages.length > 0 && !loading) {
    setCurrentPageId(pages[0].id);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <PWAInstallPrompt />
      
      <Sidebar
        pages={pages}
        currentPageId={currentPageId}
        onPageSelect={handlePageSelect}
        onCreatePage={handleCreatePage}
        onToggleFavorite={toggleFavorite}
        onDeletePage={deletePage}
        onUpdatePage={updatePage}
        collaborators={collaborators}
        currentUserId={currentUserId}
        isAdmin={isAdmin}
        onAddCollaborator={addCollaborator}
        onUpdateCollaborator={updateCollaborator}
        onRemoveCollaborator={removeCollaborator}
      />
      
      <AnimatePresence mode="wait">
        {currentPage ? (
          <motion.div
            key={currentPage.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-1"
          >
            <Editor
              page={currentPage}
              pages={pages}
              onUpdate={(updates) => updatePage(currentPage.id, updates)}
              onLinkClick={(pageId) => {
                setCurrentPageId(pageId);
              }}
              onCreatePage={(title) => {
                const newPage = createPage(title, null);
                setCurrentPageId(newPage.id);
                // El contenido ya tiene el enlace [[title]], solo necesitamos recargar
                // La página se actualizará automáticamente cuando se recargue la lista de páginas
              }}
              collaborators={collaborators.map(c => ({
                id: c.id,
                name: c.name,
                avatar: c.avatar,
              }))}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex items-center justify-center"
          >
            <div className="text-center space-y-4 max-w-md px-8">
              <div className="text-6xl mb-4">📝</div>
              <h2 className="text-2xl font-semibold text-foreground">
                Bienvenido a tu espacio de trabajo
              </h2>
              <p className="text-muted-foreground">
                Selecciona una página del panel lateral o crea una nueva para empezar a organizar tus ideas.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
