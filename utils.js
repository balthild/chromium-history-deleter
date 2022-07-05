export async function get_patterns_list() {
    const result = await chrome.storage.sync.get('patterns');
    return Array.isArray(result.patterns) ? result.patterns : [];
}

export async function put_patterns_list(patterns) {
    await chrome.storage.sync.set({ patterns });
}

export async function get_pattern(id) {
    const patterns = await get_patterns_list();
    return patterns.find(pattern => pattern.id === id);
}

export async function add_pattern(regex) {
    const patterns = await get_patterns_list();

    const id = patterns.map(x => x.id).reduce((a, b) => Math.max(a, b), 0) + 1;
    patterns.push({ id, regex });

    await put_patterns_list(patterns);
}

export async function update_pattern(id, regex) {
    const patterns = await get_patterns_list();

    const index = patterns.findIndex(x => x.id === Number(id));
    if (index >= 0) {
        patterns[index].regex = regex;
    }

    await put_patterns_list(patterns);
}

export async function remove_pattern(id) {
    const patterns = await get_patterns_list();
    put_patterns_list(patterns.filter(x => x.id !== Number(id)));
}
