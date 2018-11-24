// @flow
import { type Change } from 'slate';

import type Options from '../options';
import removeTableByKey from './removeTableByKey';

/**
 * Delete the whole table at position
 */
function removeTable(opts: Options, change: Change): Change {
    const { value } = change;
    const { start } = value.selection;

    return removeTableByKey(opts, change, start.key);
}

export default removeTable;
