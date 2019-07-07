import VList from './VList'

/**
 *
 * @function
 * @param {Object} config
 * @param {HTMLElement} config.listElement
 * @param {Array} config.data
 * @param {(number|Function)} config.itemSize
 * @param {number} [config.height]
 * @param {number} [config.width]
 * @param {boolean} config.fixedSize
 * @param {{top: number, bottom: number}} config.offItems
 * @param {(index: number, isScrolling: boolean, item: any, styles: any) => HTMLElement} config.renderItem
 * @returns {VList}
 *
 */
function VirtualList(config) {
    return new VList(config)
}

export default VirtualList
