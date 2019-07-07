import VList from './VList'

/**
 *
 * Creates a new instance of VList with the provided configuration.
 *
 * @function
 * @param {Object} config
 * @param {HTMLElement} config.listElement
 * @param {Array} config.data
 * @param {(number|Function)} config.itemSize
 * @param {number} [config.height]
 * @param {number} [config.width]
 * @param {boolean} config.fixedSize
 * @param {Object} config.offItems
 * @param {Function} config.renderItem
 * @returns {VList} The VList instance.
 *
 */
function VirtualList(config) {
    return new VList(config)
}

export default VirtualList
