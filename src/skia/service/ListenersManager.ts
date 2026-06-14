import * as Pixi from 'pixi.js-legacy';
import type { HitRegion } from './HitRegionsManager';

// Менеджер обработки событий на HTML canvas с учетом регионов попадания
export class ListenersManager {
  // Подключение обработчиков событий к canvas
  static applyListeners(
    htmlCanvas: HTMLCanvasElement,
    eventTypes: (keyof Pixi.FederatedEventMap)[],
    getRegions: () => HitRegion[],
    onCall: () => void,
  ): void {
    if (htmlCanvas instanceof HTMLCanvasElement) {
      for (const eventType of eventTypes) {
        htmlCanvas.addEventListener(eventType, (event) =>
          this.callRegionListeners(
            event as PointerEvent,
            htmlCanvas,
            getRegions,
            onCall,
          ),
        );
      }
    }
  }

  // Обработка события и определение активных регионов
  static callRegionListeners(
    event: PointerEvent,
    htmlCanvas: HTMLCanvasElement,
    getRegions: () => HitRegion[],
    onCall: () => void,
  ): void {
    const rect = htmlCanvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const clickPoint = new Pixi.Point(x, y);
    const applicableRegions = getRegions().filter((region) =>
      region.shouldApplyListeners(clickPoint),
    );
    const topRegion = applicableRegions.pop();
    if (topRegion) {
      for (const listener of topRegion.listeners) {
        if (listener.type === event.type) {
          listener.callback(event as unknown as Pixi.FederatedPointerEvent);
          onCall();
        }
      }
    }
  }
}
