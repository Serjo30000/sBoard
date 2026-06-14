import * as PIXI from 'pixi.js-legacy';
import * as SKIA from 'skia';
import { ColorConverter } from './ColorConverter';
import { GraphicsRenderer } from './GraphicsRenderer';
import { SpriteRenderer } from './SpriteRenderer';
import { HitRegionsManager } from './HitRegionsManager';
import { ListenersManager } from './ListenersManager';

// Основной рендерер сцены Pixi в Skia
export class ContainerRenderer {
  // Экземпляр CanvasKit для работы с Skia
  private readonly _canvasKit: SKIA.CanvasKit;
  // Корневой контейнер Pixi сцены
  private readonly _pixiContainer: PIXI.Container;
  // Цвет фона сцены
  private readonly _backgroundColor: SKIA.Color;
  // Skia поверхность рендеринга
  private readonly _surface: SKIA.Surface;
  // Skia canvas для отрисовки
  private readonly _canvas: SKIA.Canvas;
  // Менеджер областей взаимодействия
  private readonly _hitRegionsManager: HitRegionsManager;
  // Список обрабатываемых событий
  private readonly _eventTypes: (keyof PIXI.FederatedEventMap)[] = [
    'pointerdown',
    'pointerup',
  ];

  // Инициализация рендерера и привязка событий
  constructor(
    canvasKit: SKIA.CanvasKit,
    pixiContainer: PIXI.Container,
    htmlCanvas: HTMLCanvasElement,
    backgroundColor: string,
  ) {
    const surface = canvasKit.MakeSWCanvasSurface(htmlCanvas);
    const canvas = surface?.getCanvas() ?? null;
    if (!canvas || !surface) {
      throw new Error("Can't create canvas");
    }
    this._canvasKit = canvasKit;
    this._pixiContainer = pixiContainer;
    this._surface = surface;
    this._canvas = canvas;
    this._backgroundColor = ColorConverter.convertColor(
      this._canvasKit,
      backgroundColor,
    );
    this._hitRegionsManager = new HitRegionsManager(this._eventTypes);
    ListenersManager.applyListeners(
      htmlCanvas,
      this._eventTypes,
      () => this._hitRegionsManager.hitRegions,
      this.renderOnScreen.bind(this),
    );
  }

  // Основной метод отрисовки сцены на экран
  renderOnScreen(): void {
    setTimeout(() => {
      this._hitRegionsManager.mapObjectsToRegions(this._pixiContainer);
      this._canvas.clear(this._backgroundColor);
      this._renderContainer();
      this._surface.flush();
    }, 20);
  }

  // Рендер сцены в PDF формат
  renderOnPDF(): BlobPart | void {
    const canvas = this._surface?.getCanvas();

    if (!canvas) return;

    canvas.clear(this._backgroundColor);
    this._renderContainer();

    return canvas.makePDF();
  }

  // Рекурсивный обход всех объектов контейнера
  private _renderContainer(container: PIXI.Container = this._pixiContainer) {
    for (const child of container.children) {
      this._canvas.save();

      this._applyTransformations(child, this._canvas);

      if (child instanceof PIXI.Graphics) {
        GraphicsRenderer.render(this._canvasKit, this._canvas, child);
      } else if (child instanceof PIXI.Sprite) {
        SpriteRenderer.render(this._canvasKit, this._canvas, child);
      } else if (child instanceof PIXI.Container) {
        this._renderContainer(child);
      }

      this._canvas.restore();
    }
  }

  // Применение трансформаций Pixi к Skia canvas
  private _applyTransformations(
    displayObject: PIXI.DisplayObject,
    canvas: SKIA.Canvas,
  ): void {
    canvas.translate(displayObject.position.x, displayObject.position.y);
    canvas.rotate(displayObject.angle, 0, 0);
    canvas.scale(displayObject.scale.x, displayObject.scale.y);
  }
}
