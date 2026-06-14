import { useEffect, useRef } from 'react';
import { calculateViewWindow } from '../../utils/funtions';
import '../../styles/CanvasContainer.css';
import React from 'react';

// Контейнер для отображения canvas элемента
export default function CanvasContainer({
  canvas,
}: {
  canvas: HTMLCanvasElement;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Подключение canvas к контейнеру после монтирования
  useEffect(() => {
    if (!ref.current) return;

    ref.current.innerHTML = '';
    ref.current.appendChild(canvas);

    const onResize = () => {
      const size = calculateViewWindow(window.innerWidth);
      canvas.width = size.width;
      canvas.height = size.height;
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [canvas]);

  return <div className="canvas-container" ref={ref} />;
}
