/**
 *
 * Function to render a row item.
 *
 */
type RenderItem = (
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
type OffItems = {
    top: number
    bottom: number
}

/**
 *
 * Function to calculate the height of the item at index.
 *
 */
type ItemSize = (index: number) => number

interface VListConfig {
    listElement: HTMLElement
    data: any[]
    itemSize: number | ItemSize
    height?: number
    width?: number
    fixedSize: boolean
    offItems: OffItems
    renderItem: RenderItem
}

/**
 *
 * The VList class
 *
 */
declare class VList {
    /**
     *
     * Scrolls the list to the item at index.
     *
     * @param {number} index The index of the item to scroll to.
     *
     */
    scrollTo(index: number): void
}

/**
 *
 * Function to create a new VList with the provided configuration
 * object.
 *
 * @param {VListConfig} config The configuration to bootstrap a new Virtual List.
 * @returns {VList} A new VList instance.
 *
 */
declare function VirtualList(config: VListConfig): VList

export = VirtualList
