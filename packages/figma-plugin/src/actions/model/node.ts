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
  type: NodeType;
}

export interface NodeMetaData {
  name: string;
  children: NodeMetaData[] | undefined;
  height: number | string;
  width: number | string;
  top: number;
  left: number;
}
