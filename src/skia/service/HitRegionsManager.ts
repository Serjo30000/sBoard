import * as Pixi from 'pixi.js-legacy';

// Описание обработчика события для hit region
type HitRegionListener = {
  callback: (event: Pixi.FederatedPointerEvent) => void;
  type: string;
};

// Описание области взаимодействия на сцене
export type HitRegion = {
  shouldApplyListeners: (clickPoint: Pixi.Point) => boolean;
  listeners: HitRegionListener[];
};

// Менеджер областей попадания для обработки интерактивных событий Pixi сцены
export class HitRegionsManager {
  // Список типов событий, которые отслеживаются
  private readonly _eventTypes: (keyof Pixi.FederatedEventMap)[];
  // Список вычисленных областей взаимодействия
  private _hitRegions: HitRegion[] = [];
  // Временная точка для расчетов без лишних аллокаций
  private _tmpPoint = new Pixi.Point();

  // Инициализация менеджера с набором типов событий
  constructor(eventTypes: (keyof Pixi.FederatedEventMap)[]) {
    this._eventTypes = eventTypes;
  }

  // Получение текущих областей взаимодействия
  get hitRegions(): HitRegion[] {
    return this._hitRegions;
  }

  // Построение hit regions на основе объектов сцены
  mapObjectsToRegions(container: Pixi.Container): void {
    this._hitRegions = [];
    container.children.forEach((displayObject) => {
      const listeners = this._getDisplayObjectListeners(displayObject);
      if (displayObject instanceof Pixi.Graphics) {
        const graphicsDataArray = displayObject.geometry.graphicsData;
        graphicsDataArray.forEach((data) => {
          const shapeType = data.shape.type;
          const visible =
            data.fillStyle.visible &&
            !!data.fillStyle.color &&
            !!data.fillStyle.alpha;
          if (shapeType === Pixi.SHAPES.POLY) {
            const shape = data.shape;
            this._hitRegions.push({
              shouldApplyListeners: (clickPoint) => {
                return (
                  visible &&
                  this._isPointInPolygon(clickPoint, shape, displayObject)
                );
              },
              listeners,
            });
          } else if (shapeType === Pixi.SHAPES.RECT) {
            const shape = data.shape;
            this._hitRegions.push({
              shouldApplyListeners: (clickPoint) => {
                return (
                  visible &&
                  this._isPointInRect(clickPoint, shape, displayObject)
                );
              },
              listeners,
            });
          } else if (shapeType === Pixi.SHAPES.CIRC) {
            const shape = data.shape;
            this._hitRegions.push({
              shouldApplyListeners: (clickPoint) => {
                return (
                  visible &&
                  this._isPointInCircle(clickPoint, shape, displayObject)
                );
              },
              listeners,
            });
          } else if (shapeType === Pixi.SHAPES.ELIP) {
            const shape = data.shape;
            this._hitRegions.push({
              shouldApplyListeners: (clickPoint) => {
                return (
                  visible &&
                  this._isPointInEllipse(clickPoint, shape, displayObject)
                );
              },
              listeners,
            });
          } else if (shapeType === Pixi.SHAPES.RREC) {
            const shape = data.shape;
            this._hitRegions.push({
              shouldApplyListeners: (clickPoint) => {
                return (
                  visible &&
                  this._isPointInRoundedRect(clickPoint, shape, displayObject)
                );
              },
              listeners,
            });
          }
        });
      } else if (displayObject instanceof Pixi.Sprite) {
        this._hitRegions.push({
          shouldApplyListeners: (clickPoint) => {
            return displayObject
              .getBounds()
              .contains(clickPoint.x, clickPoint.y);
          },
          listeners,
        });
      } else if (displayObject instanceof Pixi.Container) {
        this.mapObjectsToRegions(displayObject);
      }
    });
  }

  // Сбор обработчиков событий объекта
  private _getDisplayObjectListeners(
    displayObject: Pixi.DisplayObject,
  ): HitRegionListener[] {
    let listeners: HitRegionListener[] = [];
    for (const eventType of this._eventTypes) {
      const eventTypeListeners = displayObject.listeners(eventType);
      listeners = listeners.concat(
        eventTypeListeners.map((listener) => ({
          type: eventType,
          callback: listener,
        })),
      );
    }
    return listeners;
  }

  // Проверка попадания точки в прямоугольник
  private _isPointInRect(
    point: Pixi.Point,
    shape: Pixi.Rectangle,
    displayObject: Pixi.DisplayObject,
  ) {
    const local = displayObject.worldTransform.applyInverse(
      this._tmpPoint.set(point.x, point.y),
    );

    return (
      local.x >= shape.x &&
      local.x <= shape.x + shape.width &&
      local.y >= shape.y &&
      local.y <= shape.y + shape.height
    );
  }

  // Проверка попадания в скругленный прямоугольник
  private _isPointInRoundedRect(
    point: Pixi.Point,
    shape: Pixi.RoundedRectangle,
    displayObject: Pixi.DisplayObject,
  ): boolean {
    const localPoint = displayObject.worldTransform.applyInverse(
      new Pixi.Point(point.x, point.y),
    );
    const { x, y, width, height } = shape;
    const radius = Math.min(shape.radius, width / 2, height / 2);
    if (
      localPoint.x >= x + radius &&
      localPoint.x <= x + width - radius &&
      localPoint.y >= y &&
      localPoint.y <= y + height
    ) {
      return true;
    }
    if (
      localPoint.x >= x &&
      localPoint.x <= x + width &&
      localPoint.y >= y + radius &&
      localPoint.y <= y + height - radius
    ) {
      return true;
    }
    const cornerCenters = [
      { cx: x + radius, cy: y + radius },
      { cx: x + width - radius, cy: y + radius },
      { cx: x + radius, cy: y + height - radius },
      { cx: x + width - radius, cy: y + height - radius },
    ];
    for (const { cx, cy } of cornerCenters) {
      const dx = localPoint.x - cx;
      const dy = localPoint.y - cy;

      if (Math.sqrt(dx * dx + dy * dy) <= radius) {
        return true;
      }
    }
    return false;
  }

  // Проверка попадания в круг
  private _isPointInCircle(
    point: Pixi.Point,
    shape: Pixi.Circle,
    displayObject: Pixi.DisplayObject,
  ) {
    const localPoint = displayObject.worldTransform.applyInverse(
      new Pixi.Point(point.x, point.y),
    );
    const dx = localPoint.x - shape.x;
    const dy = localPoint.y - shape.y;
    const distanceSquared = dx * dx + dy * dy;
    return distanceSquared <= shape.radius * shape.radius;
  }

  // Проверка попадания в эллипс
  private _isPointInEllipse(
    point: Pixi.Point,
    shape: Pixi.Ellipse,
    displayObject: Pixi.DisplayObject,
  ) {
    const localPoint = displayObject.worldTransform.applyInverse(
      new Pixi.Point(point.x, point.y),
    );
    const dx = (localPoint.x - shape.x) / shape.width;
    const dy = (localPoint.y - shape.y) / shape.height;
    return dx * dx + dy * dy <= 1;
  }

  // Проверка попадания в полигон
  private _isPointInPolygon(
    point: Pixi.Point,
    shape: Pixi.Polygon,
    displayObject: Pixi.DisplayObject,
  ): boolean {
    const t = displayObject.worldTransform;

    const pts = shape.points;
    const transformed: Pixi.Point[] = [];

    for (let i = 0; i < pts.length; i += 2) {
      transformed.push(t.apply(new Pixi.Point(pts[i], pts[i + 1])));
    }

    let inside = false;
    const x = point.x;
    const y = point.y;

    for (
      let i = 0, j = transformed.length - 1;
      i < transformed.length;
      j = i++
    ) {
      const current = transformed[i];
      const previous = transformed[j];

      if (!current || !previous) {
        continue;
      }

      const xi = current.x,
        yi = current.y;
      const xj = previous.x,
        yj = previous.y;

      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
        inside = !inside;
      }
    }

    return inside;
  }
}
