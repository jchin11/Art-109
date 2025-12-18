const dropdown = document.querySelector('.dropdown');
const headerBox = document.querySelector('.header-box');

/* class functions */
function addmsg(html) {
    headerBox.insertAdjacentHTML('beforeend', html);
}
function fadeout(element, duration = 800, after = () => { }) {
    element.classList.add('fade-out');
    setTimeout(() => { element.remove(); after(); }, duration);
}
function blur() {
    dropdown.classList.add('fade-blur');
    dropdown.disabled = true;
}
function unblur() {
    dropdown.classList.remove('fade-blur');
    dropdown.disabled = false;
}

/* transitions and text */
function happy(text) {
    addmsg(`<p class="happy fade-in">${text}</p>`);
}
function showdots() {
    addmsg(`<p class="header-text dots"></p>`);
}
function transition() {
    const dots = headerBox.querySelector('.dots');
    if (!dots) return;
    fadeout(dots, 800, () => {
        addmsg(`<p class="header-text fade-in">That doesn't sound right!</p>`);
    });
}

function ays() { //"Are You Sure?"
    addmsg(`<p class="header-text fade-in">Are you sure?</p>`);
    unblur();
    dropdown.innerHTML = `
    <option disabled selected>I want to...</option>
    <option>be happy?</option>`;
    noloop();
}

function noloop() {
    const status = (e) => {
        const choice = e.target.value;
        secondprompt(choice);
        dropdown.removeEventListener('change', status);
    };
    dropdown.addEventListener('change', status, { once: true });
}

function firstprompt(choice) {
    happy(choice);
    blur();
    setTimeout(() => {
        showdots();
        setTimeout(() => {
            transition();
            setTimeout(() => {
                ays();
            }, 1500);
        }, 4000);
    }, 2000);
}

function secondprompt(choice) {
    addmsg(`<p class="happy2 fade-in">${choice}</p>`);
    blur();
    setTimeout(() => {
        showdots();
        setTimeout(() => {
            const dots = headerBox.querySelector('.dots');
            if (!dots) return;
            fadeout(dots, 800, () => {
                addmsg(`<p class="header-text fade-in">I think you meant...</p>`);
                dropdown.innerHTML = `
          <option disabled selected>I want to...</option>
          <option>Buy food</option>
          <option>Pay tuition</option>
          <option>Pay rent</option>
          <option>Oil change</option>
          <option>Buy medication</option>
          <option>pay student loans</option>
          <option>pay the water bill</option>
          <option>pay the electricity bill</option>
          <option>Buy textbooks</option>
          <option>Buy gas</option>
          <option>pay car insurance</option>
          <option>pay medical insurance</option>
          <option>pay the phone bill</option>
          <option>pay gym fee</option>
          <option>Buy house supplies</option>
          `;
                unblur();
                dropdown.focus();
            });
        }, 4000);
    }, 2000);
}
/*disable drobdown */
dropdown.addEventListener('change', (e) => {
    firstprompt(e.target.value);
}, { once: true });

dropdown.addEventListener('blur', () => {
    if (!dropdown.disabled) dropdown.selectedIndex = 0;
});
