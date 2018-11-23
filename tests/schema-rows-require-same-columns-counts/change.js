import Slate from 'slate';

export default (plugin, change) => {
    const schema = Slate.Schema.create(plugin.schema);
    change.normalize(schema);

    // NOTE(johan): For some reason Slate normalization does not ever
    // try to normalise the actual table in this case, but we can force it
    // to by doing this. It's not ideal, but I suspect it's a bug in Slate.
    // The document is passed to our normalizeNode function but the table 
    // never is!?
    const table = change.value.document.getDescendant('table');
    return change.normalizeNodeByKey(table.key);
};
