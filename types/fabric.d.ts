declare module 'fabric' {
  export class Canvas {
    constructor(element: HTMLCanvasElement | string, options?: any)
    add(...objects: any[]): void
    remove(...objects: any[]): void
    setActiveObject(object: any): void
    discardActiveObject(): void
    getObjects(): any[]
    requestRenderAll(): void
    sendToBack(object: any): void
    bringToFront(object: any): void
    getZoom(): number
    setZoom(value: number): void
    toDataURL(options?: any): string
    dispose(): void
    on(event: string, handler: (e: any) => void): void
  }

  export class FabricImage {
    static fromURL(url: string): Promise<any>
    set(options: any): void
    width?: number
    height?: number
  }

  export class IText {
    constructor(text: string, options?: any)
    set(options: any): void
  }
}
