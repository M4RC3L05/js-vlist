/**
 *
 * Virtual list
 *
 * @class
 * @author M4RC3L05
 *
 */
class VList {
    /**
     *
     * The element to bind the list
     *
     * @private
     * @type {HTMLElement}
     *
     */
    _listDOM

    /**
     *
     * The array of data to display
     *
     * @private
     * @type {Array}
     *
     */
    _data

    /**
     *
     * @private
     * @type {number | Function}
     *
     */
    _itemSize

    /**
     *
     * @private
     * @type {(index: number, isScrolling: boolean, item: any, styles: any) => HTMLElement}
     *
     */
    _renderItem

    /**
     *
     * @private
     * @type {number}
     *
     */
    _listSize

    /**
     *
     * @private
     * @type {HTMLDivElement}
     *
     */
    _listContainerDOM

    /**
     *
     * @private
     * @type {number}
     *
     */
    _startCursor

    /**
     *
     * @private
     * @type {number}
     *
     */
    _endCursor

    /**
     *
     * @private
     * @type {number}
     *
     */
    _offsetTop

    /**
     *
     * @private
     * @type {{top: number, bottom: number}}
     *
     */
    _offItems

    /**
     *
     * @private
     * @type {boolean}
     *
     */
    _isScrolling

    /**
     *
     * @private
     * @type {boolean}
     *
     */
    _hasTicked

    /**
     *
     * @private
     * @type {number}
     *
     */
    _resetScrollStateTimeout

    /**
     *
     * @private
     * @type {boolean}
     *
     */
    _fixedSize

    /**
     *
     * @private
     * @type {boolean}
     *
     */
    _removeOldRAF

    /**
     *
     * @private
     * @type {boolean}
     *
     */
    _onScrollRAF

    /**
     *
     * @constructor
     * @param {Object} config
     * @param {HTMLElement} config.listElement
     * @param {Array} config.data
     * @param {(number|Function)} config.itemSize
     * @param {number} [config.height]
     * @param {number} [config.width]
     * @param {boolean} config.fixedSize
     * @param {{top: number, bottom: number}} config.offItems
     * @param {(index: number, isScrolling: boolean, item: any, styles: any) => HTMLElement} config.renderItem
     *
     */
    constructor(config) {
        this._startCursor = 0
        this._endCursor = 0
        this._offsetTop = 0
        this._isScrolling = false
        this._hasTicked = false
        this._fixedSize = config.fixedSize
        this._listDOM = config.listElement
        this._data = config.data
        this._offItems = config.offItems
        this._itemSize = config.itemSize
        this._renderItem = config.renderItem

        if (this._fixedSize) {
            if (typeof this._itemSize !== 'number')
                throw Error(
                    'For fixed sized rows, the itemSize config prop must be a number corresponding to the height of the individual item'
                )
            this._listSize = this._data.length * this._itemSize
        } else {
            if (typeof this._itemSize !== 'function')
                throw Error(
                    'For non fixed sized rows, the itemSize config prop must be a function that returns  the height of the individual item'
                )
            this._listSize = this._calcTotalHeight()
        }

        this._listContainerDOM = this._createListContainer()
        this._onListScroll = this._onListScroll.bind(this)
        this._applyStylesToList(
            config.width ? `${config.width}px` : '100%',
            config.height ? `${config.height}px` : '100%'
        )
        this._listDOM.appendChild(this._listContainerDOM)
        this._listDOM.addEventListener('scroll', this._onScroll.bind(this))

        // Init render
        this._render()
    }

    /**
     *
     * @type {Array}
     *
     */
    set data(newData) {
        if (!Array.isArray(newData)) throw Error('The data must be an array')
        this._data = newData
        this._render()
    }

    /**
     *
     * @param {number} index
     * @example
     * instance.scrollToIndex(20)
     *
     */
    scrollToIndex(index) {
        let finalIndex = -1

        if (index <= 0) finalIndex = 0
        else if (index > this._data.length) finalIndex = this._data.length
        else finalIndex = index

        if (this._fixedSize) {
            const offsetTop = finalIndex * this._itemSize

            this._scrollTo(offsetTop)
        } else {
            let offsetTop = 0

            for (let i = 0; i < finalIndex; i++) offsetTop += this._itemSize(i)

            this._scrollTo(offsetTop)
        }
    }

    _calcTotalHeight() {
        if (typeof this._itemSize !== 'function')
            throw Error(
                'For non fixed sized rows, the itemSize config prop must be a function that returns  the height of the individual item'
            )

        let heightACC = 0

        for (let i = 0, size = this._data.length; i < size; i++)
            heightACC += this._itemSize(i)

        return heightACC
    }

    /**
     *
     * @private
     * @param {number} offsetTop
     *
     */
    _scrollTo(offsetTop) {
        this._listDOM.scrollTop = offsetTop
    }

    /**
     *
     * @private
     * @param {any} e the scroll event
     *
     */
    _onScroll(e) {
        const currE = e
        this._isScrolling = true
        if (this._resetScrollStateTimeout)
            clearTimeout(this._resetScrollStateTimeout)

        this._resetScrollStateTimeout = setTimeout(() => {
            this._resetScrollStateTimeout = null
            this._resetScrollState(currE)
        }, 150)

        if (!this._onScrollRAF) {
            this._onScrollRAF = true
            window.requestAnimationFrame(() => {
                this._onListScroll(currE)
                this._onScrollRAF = false
            })
        }
    }

    /**
     *
     * @private
     * @param {any} e
     *
     */
    _resetScrollState(e) {
        this._isScrolling = false
        this._render()
    }

    /**
     *
     * @private
     * @param {string} width
     * @param {string} height
     *
     */
    _applyStylesToList(width, height) {
        this._listDOM.style.height = height
        this._listDOM.style.width = width
        this._listDOM.style.overflowY = 'scroll'
    }

    /**
     *
     * @private
     * @param {any} e
     *
     */
    _onListScroll(e) {
        if (this._offsetTop === e.target.scrollTop) return
        this._offsetTop = e.target.scrollTop
        this._render()
    }

    /**
     *
     * @private
     * @returns {HTMLDivElement} the list container
     *
     */
    _createListContainer() {
        const div = document.createElement('div')
        div.style.width = '100%'
        div.style.top = '0px'
        div.style.position = 'absolute'
        div.style.height = `${this._listSize}px`
        div.style.minHeight = `${this._listSize}px`
        div.style.maxHeight = `${this._listSize}px`
        return div
    }

    /**
     *
     * @private
     *
     */
    _updateListCursors() {
        const curr = Math.trunc(this._offsetTop / this._itemSize)

        const visibleItems = Math.trunc(
            this._listDOM.clientHeight / this._itemSize
        )

        this._startCursor = Math.max(curr - this._offItems.top, 0)

        this._endCursor = Math.min(
            curr + visibleItems + this._offItems.bottom,
            this._data.length
        )
    }

    /**
     *
     * @private
     *
     */
    _updateListCursorsNonFixedSize() {
        let startVisible = 0
        let visibleItems = 0

        for (
            let i = 0, size = this._data.length, accSize = 0;
            i < size;
            accSize += this._itemSize(i), i++
        ) {
            if (accSize < this._offsetTop) continue

            startVisible = i
            break
        }

        for (
            let i = startVisible, size = this._data.length, accSize = 0;
            i < size;
            accSize += this._itemSize(i), i++
        ) {
            if (accSize < this._listDOM.clientHeight) {
                visibleItems += 1
                continue
            }

            break
        }

        this._startCursor = Math.max(startVisible - this._offItems.top, 0)
        this._endCursor = Math.min(
            startVisible + visibleItems + this._offItems.bottom,
            this._data.length
        )
    }

    /**
     *
     * @private
     *
     */
    _clearPreviousRenderedItems() {
        while (this._listContainerDOM.firstChild)
            this._listContainerDOM.removeChild(
                this._listContainerDOM.firstChild
            )
    }

    /**
     *
     * @private
     *
     */
    _renderBatch() {
        // this._clearPreviousRenderedItems()
        if (this._data.length <= 0) return

        const fragment = document.createDocumentFragment()

        for (let i = this._startCursor; i < this._endCursor; i++)
            fragment.appendChild(
                this._renderItem(i, this._isScrolling, this._data[i], {
                    position: 'absolute',

                    top: `${i * this._itemSize}px`
                })
            )

        this._markOldToRemove()
        this._enqueueRemoveOldElements()

        this._listContainerDOM.appendChild(fragment)
    }

    /**
     *
     * @private
     *
     */
    _enqueueRemoveOldElements() {
        if (!this._removeOldRAF) {
            this._removeOldRAF = true
            window.requestAnimationFrame(() => {
                document
                    .querySelectorAll('[data-rm="1"]')
                    .forEach(ele => this._listContainerDOM.removeChild(ele))

                this._removeOldRAF = false
            })
        }
    }

    /**
     *
     * @private
     *
     */
    _markOldToRemove() {
        for (let i = 0; i < this._listContainerDOM.childNodes.length; i++) {
            this._listContainerDOM.childNodes[i].style.display = 'none'
            this._listContainerDOM.childNodes[i].setAttribute('data-rm', '1')
        }
    }

    /**
     *
     * @private
     *
     */
    _renderBatchNonFixedSize() {
        this._clearPreviousRenderedItems()

        let startTop = 0

        for (let i = 0; i < this._startCursor; i++)
            startTop += this._itemSize(i)

        const fragment = document.createDocumentFragment()

        for (let i = this._startCursor; i < this._endCursor; i++) {
            fragment.appendChild(
                this._renderItem(i, this._isScrolling, this._data[i], {
                    position: 'absolute',
                    top: `${startTop}px`,

                    height: `${this._itemSize(i)}px`
                })
            )

            startTop += this._itemSize(i)
        }

        // this._markOldToRemove()
        // this._enqueueRemoveOldElements()

        this._listContainerDOM.appendChild(fragment)
    }

    /**
     *
     * @private
     *
     */
    _render() {
        if (!this._fixedSize) {
            this._updateListCursorsNonFixedSize()
            this._renderBatchNonFixedSize()
        } else {
            this._updateListCursors()
            this._renderBatch()
        }
    }
}

export default VList