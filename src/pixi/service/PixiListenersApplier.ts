import * as Pixi from 'pixi.js-legacy';

// Класс для добавления интерактивных обработчиков событий к объектам сцены
export class PixiListenersApplier {
  // Коэффициент изменения масштаба при взаимодействии
  private readonly scaleFactor: number;
  // Внешний обработчик событий для уведомления о взаимодействии
  private readonly onEvent?: (
    type: string,
    displayObject: Pixi.DisplayObject,
  ) => void;

  // Инициализация обработчика событий и параметров взаимодействия
  constructor(
    scaleFactor = 1.1,
    onEvent?: (type: string, displayObject: Pixi.DisplayObject) => void,
  ) {
    this.scaleFactor = scaleFactor;
    if (onEvent) {
      this.onEvent = onEvent;
    }
  }

  // Применение событий ко всем объектам сцены
  public applyEventListeners(displayObjects: Pixi.DisplayObject[]): void {
    displayObjects.forEach((displayObject) => {
      displayObject.eventMode = 'dynamic';

      displayObject.on('pointerdown', () => {
        displayObject.scale.set(
          displayObject.scale.x * this.scaleFactor,
          displayObject.scale.y * this.scaleFactor,
        );

        this.onEvent?.('pointerdown', displayObject);
      });

      displayObject.on('pointerup', () => {
        displayObject.scale.set(
          displayObject.scale.x / this.scaleFactor,
          displayObject.scale.y / this.scaleFactor,
        );

        this.onEvent?.('pointerup', displayObject);
      });
    });
  }
}
