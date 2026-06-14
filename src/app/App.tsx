import React, { useEffect, useMemo } from 'react';
import * as SKIA from 'skia';

import Button from '../components/Button/Button';
import CanvasContainer from '../components/CanvasContainer/CanvasContainer';
import Views from '../components/Views/Views';
import Controls from '../components/Controls/Controls';

import { downloadPDF } from '../utils/funtions';
import useViewWindow from '../utils/useViewWindow';

import createPixiApp from '../pixi/createPixiApp';
import createRandomObjectsGenerator from '../pixi/service/createRandomObjectsGenerator';

import createSkiaWrapper from '../skia/service/createSkiaWrapper';

import '../styles/App.css';

// Основной компонент приложения
export default function App({ canvasKit }: { canvasKit: SKIA.CanvasKit }) {
  // Получение текущих размеров окна
  const viewWindow = useViewWindow();

  // Инициализация Pixi приложения и корневого контейнера
  const { pixiApp, pixiTopContainer } = useMemo(
    () =>
      createPixiApp({
        width: viewWindow.width,
        height: viewWindow.height,
        backgroundColor: '#101010',
      }),
    [],
  );

  // Создание обертки над Skia для рендеринга сцены
  const { skiaRenderer, skiaCanvas } = useMemo(
    () => createSkiaWrapper(pixiTopContainer, canvasKit, viewWindow),
    [canvasKit],
  );

  // Генератор случайных графических объектов
  const randomObjectsGenerator = useMemo(
    () => createRandomObjectsGenerator(viewWindow, skiaRenderer),
    [skiaRenderer],
  );

  // Обновление размеров канвасов при изменении окна
  useEffect(() => {
    pixiApp.renderer.resize(viewWindow.width, viewWindow.height);

    skiaCanvas.width = viewWindow.width;
    skiaCanvas.height = viewWindow.height;

    skiaRenderer.renderOnScreen();
  }, [viewWindow, pixiApp, skiaCanvas, skiaRenderer]);

  // Добавление случайного объекта на сцену
  const handleAddObjectClick = () => {
    const [object] = randomObjectsGenerator.createRandomObjects(1);

    if (object) {
      pixiTopContainer.addChild(object);
    }

    skiaRenderer.renderOnScreen();
  };

  // Экспорт текущей сцены в PDF
  const handleExportPdfClick = () => {
    const pdfBytes = skiaRenderer.renderOnPDF();

    if (pdfBytes) {
      downloadPDF(pdfBytes);
    }
  };

  // Очистка всех объектов со сцены
  const handleClearClick = () => {
    pixiTopContainer.removeChildren();

    skiaRenderer.renderOnScreen();
  };

  // UI панель управления
  return (
    <div id="app">
      <Controls>
        <Button onClick={handleAddObjectClick} text="Добавить объект" />

        <Button onClick={handleExportPdfClick} text="Экспорт в PDF" />

        <Button onClick={handleClearClick} text="Очистить" />
      </Controls>

      <Views>
        <CanvasContainer canvas={pixiApp.view} />
        <CanvasContainer canvas={skiaCanvas} />
      </Views>
    </div>
  );
}
