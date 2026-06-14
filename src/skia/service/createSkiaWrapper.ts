import * as PIXI from 'pixi.js-legacy';
import * as SKIA from 'skia';
import { createElement } from '../../utils/funtions';
import { ContainerRenderer } from './ContainerRenderer';

// Тип размеров области отображения
type ViewWindow = {
  width: number;
  height: number;
};

// Значения по умолчанию для Skia canvas
const DEFAULT_SKIA_VIEW = {
  width: 600,
  height: 500,
  background: '#101010',
} as const;

// Создание связки Skia рендерера и canvas
export default function createSkiaWrapper(
  pixiContainer: PIXI.Container,
  canvasKit: SKIA.CanvasKit,
  viewWindow: ViewWindow,
): {
  skiaRenderer: ContainerRenderer;
  skiaCanvas: HTMLCanvasElement;
} {
  // Определение ширины канваса
  const width = viewWindow.width ?? DEFAULT_SKIA_VIEW.width;
  // Определение высоты канваса
  const height = viewWindow.height ?? DEFAULT_SKIA_VIEW.height;
  // Установка фонового цвета
  const background = DEFAULT_SKIA_VIEW.background;

  // Создание canvas элемента для Skia
  const skiaCanvas = createElement('canvas', {
    style: `background: ${background}`,
    width: `${width}px`,
    height: `${height}px`,
  }) as HTMLCanvasElement;

  // Инициализация рендерера сцены Skia
  const skiaRenderer = new ContainerRenderer(
    canvasKit,
    pixiContainer,
    skiaCanvas,
    background,
  );

  return { skiaRenderer, skiaCanvas };
}
