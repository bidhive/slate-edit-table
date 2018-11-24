'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

require('slate');

var _removeTableByKey = require('./removeTableByKey');

var _removeTableByKey2 = _interopRequireDefault(_removeTableByKey);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Delete the whole table at position
 */
function removeTable(opts, change) {
    var value = change.value;
    var start = value.selection.start;


    return (0, _removeTableByKey2.default)(opts, change, start.key);
}

exports.default = removeTable;