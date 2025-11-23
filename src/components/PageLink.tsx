import { Page } from '@/types/page';
import { Link } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface PageLinkProps {
  page: Page;
  onClick: () => void;
  className?: string;
}

export const PageLink = ({ page, onClick, className }: PageLinkProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-1 rounded-md',
        'bg-accent/50 hover:bg-accent border border-border/50',
        'text-primary hover:text-primary',
        'transition-all duration-200',
        'font-medium text-sm',
        className
      )}
    >
      <span className="text-base">{page.icon}</span>
      <span>{page.title}</span>
      <Link className="w-3 h-3 opacity-60" />
    </motion.button>
  );
};

