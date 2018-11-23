import expect from 'expect';

export default function(plugin, change) {
    const { value } = change;

    // Copy the selection
    const copiedFragment = plugin.utils.getCopiedFragment(value);
    expect(copiedFragment).toBeTruthy();

    // Paste it
    return change
        .select({
            anchor: { key: 'paste-here', offset: 7 },
            focus: { key: 'paste-here', offset: 7 }
        })
        .insertFragment(copiedFragment);
}
