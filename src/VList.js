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
     * The element to bind the list.
     *
     * @private
     * @type {HTMLElement}
     *
     */
    _listDOM

    /**
     *
     * The array of data to display.
     *
     * @private
     * @type {Array}
     *
     */
    _data

    /**
     *
     * The size of an individual item in the list.
     * if not fixed size, itemSize if a function that
     * recieves the index of the element and returns the
     * corresponding height.
     *
     * @private
     * @type {number | Function}
     *
     */
    _itemSize

    /**
     *
     * A function that is called when a items needs to be created.
     * recieves the index of the lemente, if the list is scrolling
     * the item, and the styles in order to display properly in
     * the list.
     *
     * @private
     * @type {Function}
     *
     */
    _renderItem

    /**
     *
     * The total size (in px) of the list.
     * This is used to set the height of the list container
     *
     * @private
     * @type {number}
     *
     */
    _listSize

    /**
     *
     * The list conatiner element that the rows are apended to.
     * Is placed inside the list dom element.
     *
     * @private
     * @type {HTMLDivElement}
     *
     */
    _listContainerDOM

    /**
     *
     * Indicates, in the array of data, where to start
     * rendering to the list container.
     *
     * @private
     * @type {number}
     *
     */
    _startCursor

    /**
     *
     * Indicates, in the array of data, where to end
     * rendering to the list container.
     *
     * @private
     * @type {number}
     *
     */
    _endCursor

    /**
     *
     * Indicates how mutch was scrolled.
     *
     * @private
     * @type {number}
     *
     */
    _offsetTop

    /**
     *
     * A config object, dictating how many itemns should be render
     * before and after the visible area of the list.
     *
     * @private
     * @type {Object}
     *
     */
    _offItems

    /**
     *
     * Indicates whether the user is scrolling.
     *
     * @private
     * @type {boolean}
     *
     */
    _isScrolling

    /**
     *
     * Stores the number of the timeout responsible to
     * reset the scrolling state (to false).
     *
     * @private
     * @type {number}
     *
     */
    _resetScrollStateTimeout

    /**
     *
     * Indicates if the items have all the save height.
     *
     * @private
     * @type {boolean}
     *
     */
    _fixedSize

    /**
     *
     * Indicates if the previous enqueued task to
     * remove the old lementes fom the list is completed,
     * in order to not call multiple times.
     *
     * @private
     * @type {boolean}
     *
     */
    _removeOldRAF

    /**
     *
     * Indicates if the previous enqueued task to
     * handle the scroll event is completed,
     * in order to not call multiple times.
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
     * @param {Object} config.offItems
     * @param {Function} config.renderItem
     *
     */
    constructor(config) {
        this._startCursor = 0
        this._endCursor = 0
        this._offsetTop = 0
        this._isScrolling = false
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
     * Sets the new data and rerenders the list.
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
     * Scrolls the list to the item at specific index.
     *
     * @param {number} index the index of the item in the array.
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

    /**
     *
     * Calculates the height of the list.
     *
     * @private
     *
     */
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
     * Scrolls the list by a offset.
     *
     * @private
     * @param {number} offsetTop the amount to scroll.
     *
     */
    _scrollTo(offsetTop) {
        this._listDOM.scrollTop = offsetTop
    }

    /**
     *
     * Handles the list scrolling event
     *
     * @private
     * @param {Event} e The scroll event.
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
     * Resets the scrolling state (sets to false).
     *
     * @private
     * @param {any} e The scrolling event.
     *
     */
    _resetScrollState(e) {
        this._isScrolling = false
        this._render()
    }

    /**
     *
     * Sets the visible list styles.
     *
     * @private
     * @param {string} width The width of the list.
     * @param {string} height The height of the list.
     *
     */
    _applyStylesToList(width, height) {
        this._listDOM.style.height = height
        this._listDOM.style.width = width
        this._listDOM.style.overflowY = 'scroll'
    }

    /**
     *
     * Updates the offset top on every scroll.
     *
     * @private
     * @param {any} e The scrolling event.
     *
     */
    _onListScroll(e) {
        if (this._offsetTop === e.target.scrollTop) return
        this._offsetTop = e.target.scrollTop
        this._render()
    }

    /**
     *
     * Creates the items container element that olds the elementes
     * that are rendered.
     * Also gets the height of the size of the list.
     *
     * @private
     * @returns {HTMLDivElement} the list container.
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
     * Updates the start and end cursors when all the items
     * have the same size.
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
     * Updates the start and end cursors when all the items
     * not have the same size.
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
     * Loops to all of the items of the container and removes them.
     *
     * @private
     * @deprecated
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
     * Renders the items starting from _startCursor up to _endCursor
     * when items are the same size.
     *
     * @private
     *
     */
    _renderBatch() {
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
     * Enqueues to the animation frame a function
     * to remove the old elements from the list container.
     * Is called before a new batch of elementes are render to the list container
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
     * Marks all the elementes in the container element and sets them
     * to remove.
     * Is called before a new batch of elementes are render to the list container
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
     * Renders the items starting from _startCursor up to _endCursor
     * when items are not the same size.
     *
     * @private
     *
     */
    _renderBatchNonFixedSize() {
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

        this._markOldToRemove()
        this._enqueueRemoveOldElements()

        this._listContainerDOM.appendChild(fragment)
    }

    /**
     *
     * Calls the method to update the list cursors and the method
     * to render the next elements to the list container.
     * Based on the flag fixedSize (_fixedSize in the class), will call the correct methods.
     * Its callled when anew scroll events is fired
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
