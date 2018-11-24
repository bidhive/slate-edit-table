// @flow
import { type Change } from 'slate';

import { TablePosition } from '../utils';
import type Options from '../options';
import removeRowByKey from './removeRowByKey';

/**
 * Remove current row in a table. Clear it if last remaining row
 */
function removeRow(opts: Options, change: Change, at: number): Change {
    const { value } = change;
    const { start } = value.selection;

    const pos = TablePosition.create(opts, value.document, start.key);

    let rowKey;
    if (typeof at === 'undefined') {
        rowKey = pos.row.key;
    } else {
        rowKey = pos.table.nodes.get(at).key;
    }

    return removeRowByKey(opts, change, rowKey);
}

export default removeRow;
