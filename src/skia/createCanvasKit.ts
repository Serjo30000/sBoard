import CanvasKitInit from 'skia';
import * as SKIA from 'skia';

// Инициализация CanvasKit для Skia рендеринга
export default async function createCanvasKit(): Promise<SKIA.CanvasKit> {
  try {
    // Загрузка модуля CanvasKit
    const canvasKit = await CanvasKitInit({
      locateFile: (file) => `/sBoard/${file}`,
    });

    return canvasKit;
  } catch (error) {
    console.error('Failed to initialize CanvasKit:', error);
    throw error;
  }
}
