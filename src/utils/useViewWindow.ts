import { useEffect, useState } from 'react';
import { calculateViewWindow } from '../utils/funtions';

// Хук для отслеживания размеров области отображения
export default function useViewWindow() {
  // Состояние для хранения размеров рабочей области
  const [viewWindow, setViewWindow] = useState(() =>
    calculateViewWindow(window.innerWidth),
  );

  // Обработка изменения размеров окна браузера
  useEffect(() => {
    const onResize = () => {
      setViewWindow(calculateViewWindow(window.innerWidth));
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return viewWindow;
}
