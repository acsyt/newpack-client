import type { FC, ReactNode } from 'react';

import { Drawer, DrawerProps, IconButton, Typography } from '@mui/material';
import { X } from 'lucide-react';

import { cn } from '@/config/utils/cn.util';

interface CustomDrawerProps extends DrawerProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  width?: number | string;
}

export const CustomDrawer: FC<CustomDrawerProps> = ({
  title,
  onClose,
  children,
  footer,
  width = 450,
  PaperProps,
  ...props
}) => {
  return (
    <Drawer
      anchor='right'
      onClose={onClose}
      {...props}
      PaperProps={{
        ...PaperProps,
        className: cn(
          'w-[calc(100%-16px)] m-1 h-[calc(100%-16px)] sm:h-[calc(100%-32px)]',
          'rounded-xl border border-divider shadow-2xl',
          PaperProps?.className
        ),
        style: {
          width: typeof width === 'number' ? `${width}px` : width,
          maxWidth: '100%',
          ...PaperProps?.style
        }
      }}
    >
      <div className='flex flex-col h-full'>
        <div className='p-5 flex items-center justify-between border-b border-divider'>
          <Typography variant='h6' fontWeight={600}>
            {title}
          </Typography>
          <IconButton size='small' onClick={onClose}>
            <X size={20} />
          </IconButton>
        </div>

        <div className='flex-1 overflow-auto p-6'>{children}</div>

        {footer && <div className='p-5 border-t border-divider'>{footer}</div>}
      </div>
    </Drawer>
  );
};
