import { PixiObjectsGenerator } from './PixiObjectsGenerator';
import imageOne from '../../assets/1.png';
import imageTwo from '../../assets/2.png';
import imageThree from '../../assets/3.png';
import type { ContainerRenderer } from '../../skia/service/ContainerRenderer';

// Хук для генерации случайных объектов Pixi
export default function createRandomObjectsGenerator(
  windowSize: {
    width: number;
    height: number;
  },
  skiaRenderer: ContainerRenderer,
) {
  // Создание генератора объектов с набором изображений
  return new PixiObjectsGenerator(
    [imageOne, imageTwo, imageThree],
    skiaRenderer,
    windowSize,
  );
}
