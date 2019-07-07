export type RenderItem = (
    index: number,
    isScrolling: boolean,
    item: any,
    styles: any
) => HTMLElement
export type OffItems = {
    top: number
    bottom: number
}
export type ItemSize = (index: number) => number
export interface VListConfig {
    listElement: HTMLElement
    data: any[]
    itemSize: number | ItemSize
    height?: number
    width?: number
    fixedSize: boolean
    offItemns: OffItems
    renderItem: RenderItem
}

export class VList {
    scrollTo(offsetTop: number): void
    set data(newData: any[]): void
}

export function VirtualList(config: VListConfig): VList
