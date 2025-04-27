// ==UserScript==
// @name         Packing Mode for LighterPack
// @namespace    https://github.com/mrooney/lp-packing-mode
// @version      0.1
// @description  A packing mode for LighterPack, allowing you to check off items as you pack them.
// @author       Michael Rooney
// @match        https://lighterpack.com/
// @match        https://www.lighterpack.com/
// @grant        none
// ==/UserScript==

(function() {
    // Create CSS for Packing Mode
    const style = document.createElement('style');
    style.textContent = `
        body.lpPackingModeEnabled li.lpPackingModeChecked {
            opacity: 0.2;
            textDecoration = 'line-through';
        }
        body .lpPackingMode {
            display: none;
        }
        body.lpPackingModeEnabled .lpPackingMode {
            display: inline-block;
        }
    `
    document.head.appendChild(style);

    // Add a button to toggle Packing Mod on and off.
    const packingModeSpan = document.createElement('span');
    packingModeSpan.textContent = '🧳 Pack';
    packingModeSpan.className = 'headerItem';
    const header = document.querySelector('div#header');
    header.insertBefore(packingModeSpan, header.children[2]);
    packingModeSpan.addEventListener('click', () => {
        const packingModEnabled = packingModeSpan.classList.toggle('enabled');
        togglePackingMode(packingModEnabled);
    });

    // Add a checkbox column header to each packing item list.
    const listHeaders = document.querySelectorAll('ul.lpItems > li.lpHeader');
    listHeaders.forEach((li, index) => {
        const header = document.createElement('span');
        header.className = 'lpPackingMode';
        header.textContent = '✅';
        li.firstChild.after(header);
    });

    // Add a checkbox to each individual packing item.
    const listItems = document.querySelectorAll('ul.lpItems > li.lpItem');
    listItems.forEach((row, index) => {
        const checkbox = document.createElement('input');
        checkbox.className = 'lpPackingMode';
        const categoryId = row.closest('li.lpCategory').id;
        const storageKey = `lp-${categoryId}-checkbox-${index}`;
        checkbox.type = 'checkbox';
        checkbox.addEventListener('change', (e) => {
            setCheckboxVisualState(e.target, e.target.checked);
            // Save the checkbox state to local storage.
            localStorage.setItem(storageKey, e.target.checked);
        });

        // Insert the checkbox before the item name.
        row.firstChild.after(checkbox);

        // Load the checkbox state from local storage
        const savedState = localStorage.getItem(storageKey);
        if (savedState !== null) {
            checkbox.checked = savedState === 'true';
            setCheckboxVisualState(checkbox, checkbox.checked);
        }
    });

    function setCheckboxVisualState(checkbox, isChecked) {
        const row = checkbox.closest('li');
        if (isChecked) {
            row.classList.add('lpPackingModeChecked');
        } else {
            row.classList.remove('lpPackingModeChecked');
        }
    }

    function togglePackingMode(enabled) {
        const packingModeElements = document.querySelectorAll('.lpPackingMode');
        packingModeElements.forEach((element) => {
            document.body.classList.remove('lpPackingModeEnabled');
            if (enabled) {
                document.body.classList.add('lpPackingModeEnabled');
            }
        });
    }
})();