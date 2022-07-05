import { html, render } from './lib/lit-html/lit-html.js';
import { classMap } from './lib/lit-html/directives/class-map.js';
import { unsafeHTML } from './lib/lit-html/directives/unsafe-html.js';
import { RegexColorizer } from './lib/regex-colorizer.js';
import { get_patterns_list, add_pattern, remove_pattern, update_pattern, get_pattern } from './utils.js';

let cached_patterns = [];

/**
 * @param {object} props
 * @param {false|number} props.editing
 */
async function render_cached_patterns(props = {}) {
    const { editing = false } = props;

    if (cached_patterns.length === 0) {
        let content = html`
            <div class="row">
                <div class="message">No patterns.</div>
            </div>
        `;
        render(content, document.getElementById('patterns'));
    } else {
        let content = html`
            ${cached_patterns.map((pattern) => {
                const { id, regex, disabled } = pattern;

                const row_classes = classMap({
                    disabled,
                    editing,
                    current: editing === id,
                });

                const regex_html = RegexColorizer.colorizeText(regex);

                return html`
                    <div class="row ${row_classes}">
                        <pre class="col regex">${unsafeHTML(regex_html)}</pre>
                        <div class="col action">
                            <button class="btn btn-edit" data-id="${id}" title="Edit" tabindex="${editing ? 0 : -1}">
                                <img src="assets/remix-edit.svg" alt="Edit">
                            </button>
                            <button class="btn btn-remove" data-id="${id}" title="Remove" tabindex="${editing ? 0 : -1}">
                                <img src="assets/remix-delete-bin.svg" alt="Remove">
                            </button>
                        </div>
                    </div>
                `;
            })}
        `;
        render(content, document.getElementById('patterns'));
    }
}

async function refresh_patterns() {
    cached_patterns = await get_patterns_list();
    render_cached_patterns();
}

function sync_input_height(textarea, highlight) {
    const pos = window.scrollY;
    textarea.style.height = '0';
    textarea.scrollTop = 0;
    const height = textarea.scrollHeight;
    textarea.style.height = `${height}px`;
    highlight.style.height = `${height}px`;
    window.scrollTo(0, pos);
}

function clear_input(textarea, highlight) {
    textarea.value = '';
    highlight.innerHTML = '';
    textarea.style.height = '';
    highlight.style.height = '';
}

function enter_edit_mode(id) {
    document.getElementById('new').classList.add('hidden');
    document.getElementById('edit').classList.remove('hidden');

    document.getElementById('edit_save').dataset.id = id;
}

function leave_edit_mode() {
    document.getElementById('new').classList.remove('hidden');
    document.getElementById('edit').classList.add('hidden');

    document.getElementById('edit_save').dataset.id = '';
}

document.addEventListener('DOMContentLoaded', refresh_patterns);

document.querySelectorAll('.regex-input').forEach((container) => {
    const textarea = container.querySelector('textarea');
    const highlight = container.querySelector('pre');

    textarea.addEventListener('input', (event) => {
        const regex = textarea.value;
        highlight.innerHTML = RegexColorizer.colorizeText(regex);
        sync_input_height(textarea, highlight);
    });

    window.addEventListener('resize', () => {
        sync_input_height(textarea, highlight);
    });
});

document.getElementById('new_save').addEventListener('click', async () => {
    const textarea = document.getElementById('new_input');
    const highlight = document.getElementById('new_highlight');

    const regex = textarea.value;
    if (regex.length === 0) {
        return;
    }

    await add_pattern(regex);

    clear_input(textarea, highlight);

    await refresh_patterns();
});

document.getElementById('edit_save').addEventListener('click', async (event) => {
    const textarea = document.getElementById(`edit_input`);
    const highlight = document.getElementById(`edit_highlight`);

    const regex = textarea.value;
    if (regex.length === 0) {
        return;
    }

    const id = event.target.dataset.id;
    await update_pattern(id, regex);

    clear_input(textarea, highlight);
    leave_edit_mode();
    refresh_patterns();
});

document.getElementById('edit_cancel').addEventListener('click', async () => {
    const textarea = document.getElementById(`edit_input`);
    const highlight = document.getElementById(`edit_highlight`);

    clear_input(textarea, highlight);
    leave_edit_mode();
    render_cached_patterns();
});

// Delegated event handler for remove buttons
document.addEventListener('click', async (event) => {
    const btn = event.target.closest('.btn.btn-remove');
    if (!btn || !btn.contains(event.target)) {
        return;
    }

    if (!confirm('Are you sure want to remove this pattern?')) {
        return true;
    }

    const id = Number(btn.dataset.id);
    await remove_pattern(id);

    await refresh_patterns();
});

// Delegated event handler for edit buttons
document.addEventListener('click', async (event) => {
    const btn = event.target.closest('.btn.btn-edit');
    if (!btn || !btn.contains(event.target)) {
        return;
    }

    const id = Number(btn.dataset.id);
    const pattern = await get_pattern(id);

    enter_edit_mode(id);
    render_cached_patterns({ editing: id });

    const textarea = document.getElementById(`edit_input`);
    const highlight = document.getElementById(`edit_highlight`);

    textarea.value = pattern.regex;
    textarea.focus();
    highlight.innerHTML = RegexColorizer.colorizeText(pattern.regex);
    sync_input_height(textarea, highlight);
});
