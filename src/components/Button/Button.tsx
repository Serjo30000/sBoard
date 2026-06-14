import React from 'react';
import '../../styles/Button.css';

// Свойства кнопки
type ButtonProps = {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  text: string;
};

// Обработчик нажатия и текст кнопки
export default function Button({ onClick, text }: ButtonProps) {
  return (
    <button className="button" onClick={onClick}>
      {text}
    </button>
  );
}
