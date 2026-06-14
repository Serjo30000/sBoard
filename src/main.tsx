import { createRoot } from 'react-dom/client';
import React from 'react';
import App from './app/App';
import createCanvasKit from './skia/createCanvasKit';

// Инициализация приложения после загрузки страницы
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Получение корневого контейнера приложения
    const root = document.getElementById('root');

    if (!root) return;

    // Инициализация библиотеки Skia
    const canvasKit = await createCanvasKit();

    // Рендеринг React приложения
    createRoot(root).render(<App canvasKit={canvasKit} />);
  } catch (e) {
    console.error(e);
  }
});
