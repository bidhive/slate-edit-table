import expect from 'expect';

export default function(plugin, change) {
    const res = plugin.onKeyDown(
        {
            key: 'Backspace',
            preventDefault() {},
            stopPropagation() {}
        },
        change
    );

    return change;
}
