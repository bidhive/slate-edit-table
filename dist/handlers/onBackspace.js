'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

require('slate');

var _changes = require('../changes');

function onBackspace(event, change, editor, opts) {
    var value = change.value;
    var startBlock = value.startBlock,
        endBlock = value.endBlock,
        document = value.document;
    var _value$selection = value.selection,
        start = _value$selection.start,
        isCollapsed = _value$selection.isCollapsed;

    var startOffset = start.offset;

    var startCell = document.getClosest(startBlock.key, opts.isCell);
    var endCell = document.getClosest(endBlock.key, opts.isCell);

    var startBlockIndex = startCell.nodes.findIndex(function (block) {
        return block.key == startBlock.key;
    });

    // If a cursor is collapsed at the start of the first block, do nothing
    if (startOffset === 0 && isCollapsed && startBlockIndex === 0) {
        if (change.value.schema.isVoid(startBlock)) {
            // Delete the block normally if it is a void block
            return undefined;
        }

        event.preventDefault();
        return change;
    }

    // If "normal" deletion, we continue
    if (startCell === endCell) {
        return undefined;
    }

    // If cursor is between multiple blocks,
    // we clear the content of the cells.
    event.preventDefault();

    var blocks = value.blocks;

    // Get all cells that contains the selection

    var cells = blocks.map(function (node) {
        return node.type === opts.typeCell ? node : document.getClosest(node.key, function (a) {
            return a.type === opts.typeCell;
        });
    }).toSet();

    // If the cursor is at the very end of the first cell, ignore it.
    // If the cursor is at the very start of the last cell, ignore it.
    // This behavior is to compensate hanging selection behaviors:
    // https://github.com/ianstormtaylor/slate/pull/1605
    var selection = value.selection.moveToStart();
    var ignoreFirstCell = selection.isCollapsed && selection.start.isAtEndOfNode(cells.first());
    selection = value.selection.moveToEnd();
    var ignoreLastCell = selection.isCollapsed && selection.start.isAtStartOfNode(cells.last());

    var cellsToClear = cells;
    if (ignoreFirstCell) {
        cellsToClear = cellsToClear.rest();
    }
    if (ignoreLastCell) {
        cellsToClear = cellsToClear.butLast();
    }

    // Clear all the selection
    cellsToClear.forEach(function (cell) {
        return (0, _changes.clearCell)(opts, change, cell);
    });

    // Update the selection properly, and avoid reset of selection
    var updatedStartCell = change.value.document.getDescendant(cellsToClear.first().key);
    return change.moveToStartOfNode(updatedStartCell);
}

exports.default = onBackspace;