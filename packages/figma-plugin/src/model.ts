export interface RenderBounds {
  x: number | string;
  y: number | string;
  height: number | string;
  width: number | string;
}
export interface NodeElement {
  id: string;
  name: string;
  children: NodeElement[] | undefined;
  renderBounds: RenderBounds;
}
