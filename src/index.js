import VList from './VList'

/**
 *
 * @function
 * @param {Object} config
 * @param {HTMLElement} config.listElement
 * @param {Array} config.data
 * @param {(number|ItemSize)} config.itemSize
 * @param {number} [config.height]
 * @param {number} [config.width]
 * @param {boolean} config.fixedSize
 * @param {OffItems} config.offItems
 * @param {RenderItem} config.renderItem
 * @returns {VList}
 *
 */
function VirtualList(config) {
    return new VList(config)
}

export default VirtualList
