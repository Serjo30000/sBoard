import React, { type ReactNode } from 'react';
import '../../styles/Views.css';

// Свойства контейнера представлений
type ViewsProps = {
  children: ReactNode;
};

// Компонент контейнера для областей отображения
export default function Views({ children }: ViewsProps) {
  return <div className="views">{children}</div>;
}
