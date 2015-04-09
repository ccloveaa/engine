'use strict';

var Dispatch = require('./Dispatcher');
var Node = require('./Node');
var Size = require('./Size');

/**
 * Context is the bottom of the scene graph. It is it's own
 * parent and provides the global updater to the scene graph.
 *
 * @class Context
 * @constructor
 *
 * @param {String} selector a string which is a dom selector
 *                 signifying which dom element the context
 *                 should be set upon
 * @param {Famous} a class which conforms to Famous' interface
 *                 it needs to be able to send methods to
 *                 the renderers and update nodes in the scene graph
 */
function Context (selector, famous) {
    Node.call(this);
    this._famous = famous;

    this._dispatch = new Dispatch(this);
    this._selector = selector;

    this.onMount(this, selector);
    this._famous.message('NEED_SIZE_FOR').message(selector);
    this.show();
}

// Context inherits from node
Context.prototype = Object.create(Node.prototype);
Context.prototype.constructor = Context;

/**
 * Context getUpdater function returns the passed in updater
 *
 * @return {Famous} the updater for this Context
 */
Context.prototype.getUpdater = function getUpdater () {
    return this._famous;
};

/**
 * Returns the selector that the context was instantiated with
 *
 * @return {String} dom selector
 */
Context.prototype.getSelector = function getSelector () {
    return this._selector;
};

/**
 * Returns the dispatcher of the context. Used to send events
 * to the nodes in the scene graph.
 *
 * @return {Dispatcher} the Context's Dispatcher
 */
Context.prototype.getDispatch = function getDispatch () {
    return this._dispatch;
};

/**
 * Receives an event. If the event is 'CONTEXT_RESIZE' it sets the size of the scene
 * graph to the payload, which must be an array of numbers of at least
 * length three representing the pixel size in 3 dimensions.
 *
 * @param {String} event
 * @param {*} payload
 */
Context.prototype.onReceive = function onReceive (event, payload) {
    if (event === 'CONTEXT_RESIZE') {
        this.setSizeMode(Size.ABSOLUTE, Size.ABSOLUTE, Size.ABSOLUTE);
        this.setAbsoluteSize(payload[0], payload[1], payload[2]);
    }
};

module.exports = Context;

