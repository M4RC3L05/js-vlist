/**
 *
 * Function to render a row item.
 *
 */
export type RenderItem = (
    index: number,
    isScrolling: boolean,
    item: any,
    styles: { [key: string]: string }
) => HTMLElement

/**
 *
 * OffItems configuration object.
 *
 */
export type OffItems = {
    top: number
    bottom: number
}

/**
 *
 * Function to calculate the height of the item at index.
 *
 */
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

/**
 *
 * The VList class
 *
 */
export class VList {
    /**
     *
     * Scrolls the list to the item at index.
     *
     * @param {number} index The index of the item to scroll to.
     *
     */
    scrollTo(index: number): void

    set data(newData: any[]): void
}

/**
 *
 * Function to create a new VList with the provided configuration
 * object.
 *
 * @param {VListConfig} config The configuration to bootstrap a new Virtual List.
 * @returns A new VList instance.
 *
 */
export function VirtualList(config: VListConfig): VList
