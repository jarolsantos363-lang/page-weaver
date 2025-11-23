import { Page } from '@/types/page';
import { PageLink } from './PageLink';
import { cn } from '@/lib/utils';

interface ContentRendererProps {
  content: string;
  pages: Page[];
  onLinkClick: (pageId: string) => void;
  onCreatePage?: (title: string) => void;
  className?: string;
}

export const ContentRenderer = ({ content, pages, onLinkClick, onCreatePage, className }: ContentRendererProps) => {
  const parseContent = (text: string): Array<{ type: 'text' | 'link'; content: string; pageId?: string }> => {
    const parts: Array<{ type: 'text' | 'link'; content: string; pageId?: string }> = [];
    const linkRegex = /\[\[([^\]]+)\]\]/g;
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
      }
      
      const pageName = match[1];
      const linkedPage = pages.find(p => 
        p.title.toLowerCase() === pageName.toLowerCase()
      );
      
      if (linkedPage) {
        parts.push({ type: 'link', content: pageName, pageId: linkedPage.id });
      } else {
        // Mostrar enlace roto con estilo diferente
        parts.push({ type: 'link', content: pageName, pageId: undefined });
      }
      
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push({ type: 'text', content: text.slice(lastIndex) });
    }

    return parts.length > 0 ? parts : [{ type: 'text', content: text }];
  };

  const parts = parseContent(content);

  return (
    <span className={cn('inline-flex items-center flex-wrap gap-1', className)}>
      {parts.map((part, idx) => {
        if (part.type === 'link') {
          if (part.pageId) {
            const page = pages.find(p => p.id === part.pageId);
            if (page) {
              return (
                <PageLink
                  key={idx}
                  page={page}
                  onClick={() => onLinkClick(part.pageId!)}
                />
              );
            }
          } else {
            // Enlace a página que no existe - clickeable para crear
            return (
              <button
                key={idx}
                onClick={() => {
                  if (onCreatePage) {
                    onCreatePage(part.content);
                  }
                }}
                className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50 border border-dashed border-muted-foreground/30 text-muted-foreground text-sm hover:bg-muted hover:border-muted-foreground/50 transition-colors cursor-pointer"
                title={`Crear página "${part.content}"`}
              >
                <span>{part.content}</span>
                <span className="text-xs opacity-60">(crear)</span>
              </button>
            );
          }
        }
        return <span key={idx}>{part.content}</span>;
      })}
    </span>
  );
};

