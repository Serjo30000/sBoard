import React, { type ReactNode } from 'react';
import '../../styles/Controls.css';

// Свойства панели управления
type ControlsProps = {
  children: ReactNode;
};

// Компонент панели управления
export default function Controls({ children }: ControlsProps) {
  return <div className="controls">{children}</div>;
}
