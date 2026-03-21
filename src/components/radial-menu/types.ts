import { ReactNode } from 'react';

export interface MenuItem {
  id: string;
  icon: ReactNode;
  svgPath: string;
  label: string;
  color: string;
}

export interface Position {
  x: number;
  y: number;
}
