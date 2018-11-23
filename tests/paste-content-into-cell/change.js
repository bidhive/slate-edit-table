import expect from 'expect';

export default function(plugin, change) {
    const { value } = change;

    // Copy the selection
    let copiedFragment = plugin.utils.getCopiedFragment(value);
    expect(copiedFragment).toBeFalsy();

    copiedFragment = value.fragment;

    // Paste it
    return change
        .select({
            anchor: { key: 'cell', offset: 0 },
            focus: { key: 'cell', offset: 5 }
        })
        .insertFragment(copiedFragment);
}
