'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slate = require('slate');

var _utils = require('../utils');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
 * Returns a schema definition for the plugin
 */
function schema(opts) {
    var _blocks;

    return {
        blocks: (_blocks = {}, _defineProperty(_blocks, opts.typeTable, {
            nodes: [{ match: { type: opts.typeRow } }]
        }), _defineProperty(_blocks, opts.typeRow, {
            nodes: [{ match: { type: opts.typeCell } }],
            parent: { type: opts.typeTable },
            normalize: function normalize(change, error) {
                switch (error.code) {
                    case "child_type_invalid":
                        return onlyCellsInRow(opts, change, error);
                    case "parent_type_invalid":
                        return rowOnlyInTable(opts, change, error);
                    default:
                        return undefined;
                }
            }
        }), _defineProperty(_blocks, opts.typeCell, {
            nodes: [{ match: { object: "block" } }],
            parent: { type: opts.typeRow },
            normalize: function normalize(change, error) {
                switch (error.code) {
                    case "child_object_invalid":
                        return onlyBlocksInCell(opts, change, error);
                    case "parent_type_invalid":
                        return cellOnlyInRow(opts, change, error);
                    default:
                        return undefined;
                }
            }
        }), _blocks)
    };
}

/*
 * A row's children must be cells.
 * If they're not then we wrap them within a cell.
 */
function onlyCellsInRow(opts, change, error) {
    var cell = (0, _utils.createCell)(opts, []);
    var index = error.node.nodes.findIndex(function (child) {
        return child.key === error.child.key;
    });
    change.insertNodeByKey(error.node.key, index, cell, { normalize: false });
    change.moveNodeByKey(error.child.key, cell.key, 0, { normalize: false });
}

/*
 * Rows can't live outside a table, if one is found then we wrap it within a table.
 */
function rowOnlyInTable(opts, change, error) {
    return change.wrapBlockByKey(error.node.key, opts.typeTable);
}

/*
 * A cell's children must be "block"s.
 * If they're not then we wrap them within a block with a type of opts.typeContent
 */
function onlyBlocksInCell(opts, change, error) {
    var block = _slate.Block.create({
        type: opts.typeContent
    });
    change.insertNodeByKey(error.node.key, 0, block, { normalize: false });

    var inlines = error.node.nodes.filter(function (node) {
        return node.object !== 'block';
    });
    inlines.forEach(function (inline, index) {
        change.moveNodeByKey(inline.key, block.key, index, {
            normalize: false
        });
    });
}

/*
 * Cells can't live outside a row, if one is found then we wrap it within a row.
 */
function cellOnlyInRow(opts, change, error) {
    return change.wrapBlockByKey(error.node.key, opts.typeRow);
}

exports.default = schema;