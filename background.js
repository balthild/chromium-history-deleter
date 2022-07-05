import { get_patterns_list } from './utils.js';

chrome.history.onVisited.addListener(async function (event) {
    const patterns = await get_patterns_list();
    for (const pattern of patterns) {
        let re = new RegExp(pattern.regex);
        if (re.test(event.url)) {
            chrome.history.deleteUrl({
                'url': event.url
            });
            break;
        }
    }
});
