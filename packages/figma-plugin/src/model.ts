export interface RenderBounds {
  x: number;
  y: number;
  height: number | string;
  width: number | string;
}
export interface NodeElement {
  id: string;
  name: string;
  children: NodeElement[] | undefined;
  renderBounds: RenderBounds;
}
