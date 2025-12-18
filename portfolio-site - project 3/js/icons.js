document.addEventListener("DOMContentLoaded", () => {
    const iconlist = {
        "Buy textbooks": "books.png",
        "Buy food": "hamburger-soda.png",
        "Pay tuition": "graduation-cap.png",
        "Pay rent": "rent-signal.png",
        "Oil change": "car-oil.png",
        "Buy medication": "capsules.png",
        "pay student loans": "handshake-deal-loan.png",
        "pay the water bill": "faucet.png",
        "pay the electricity bill": "lightbulb-on.png",
        "Buy gas": "gas-pump-alt.png",
        "pay car insurance": "car-side.png",
        "pay medical insurance": "hospital-user.png",
        "pay the phone bill": "mobile-notch.png",
        "pay gym fee": "gym.png",
        "Buy house supplies": "shopping-bag.png"
    };

    let total = 0;
    let counter = null;
    let iconid = 0;
    const iconRef = new Map();

    function dropdownReady(dd) { // make sure 3rd dropdown appears b4 score counter
        if (!dd) return false;
        if (dd.disabled || dd.classList.contains("fade-blur")) return false;
        return Array.from(dd.options || []).some(o => iconlist[o.value]); 
    }

    function everything(dd) { //"Do everything option" on 3rd dropdown
        if (!dd) return;
        const exists = Array.from(dd.options).some(o => o.value === "Do Everything...");
        if (!exists) dd.append(new Option("Do Everything...", "Do Everything...")); //double check 3rd dropdown cause this is annoying
    }

    function scorecounter(dd) { //score increment and class changes for dragging over/off score box
        if (!dropdownReady(dd)) return;
        if (!counter) {
            counter = document.createElement("div");
            counter.className = "score-display score-drop";
            counter.textContent = `Things Done Today: ${total}.`;
            dd.insertAdjacentElement("afterend", counter);

            counter.addEventListener("dragover", (e) => {
                e.preventDefault();
                counter.classList.add("dragover");
            });

            counter.addEventListener("dragleave", () => {
                counter.classList.remove("dragover");
            });

            counter.addEventListener("drop", (e) => {
                e.preventDefault();
                counter.classList.remove("dragover");
                const id = e.dataTransfer.getData("text/icon-id");
                const img = iconRef.get(id);
                if (img) {
                    iconRef.delete(id);
                    removeIcon(img);
                    increment();
                }
            });
        }
    }

    function increment() {
        total++;
        if (counter) counter.textContent = `Things Done Today: ${total}.`;
    }

    function removeIcon(img) {
        img.alive = false;
        img.classList.add("fade");
        setTimeout(() => img.remove(), 1100);
    }

    function spawnIcon(file, altText) {
        const img = document.createElement("img");
        img.src = `images/${file}`;
        img.alt = altText; //may use later
        img.className = "floating-icon";
        img.draggable = true;
        document.body.appendChild(img);

        let x = Math.random() * Math.max(0, window.innerWidth - 100); //havent tested on mobile i guess
        let y = Math.random() * Math.max(0, window.innerHeight - 100);
        let dx = (Math.random() * 1.5 + 0.3) * (Math.random() < 0.5 ? -1 : 1);
        let dy = (Math.random() * 1.5 + 0.3) * (Math.random() < 0.5 ? -1 : 1);

        img.style.position = "fixed";
        img.style.left = `${x}px`;
        img.style.top = `${y}px`;

        const id = `icon-${++iconid}`;
        img.dataset.iconid = id;
        iconRef.set(id, img);

        img.alive = true; //allow move

        function bounce() {
            if (!img.alive) return; 
            x += dx; y += dy;
            const w = img.width, h = img.height;
            if (x <= 0 || x + w >= window.innerWidth) dx *= -1; //icons get stuck if resize window, will have to work on
            if (y <= 0 || y + h >= window.innerHeight) dy *= -1;
            img.style.left = `${x}px`;
            img.style.top = `${y}px`; 
            requestAnimationFrame(bounce);//loop
        }
        requestAnimationFrame(bounce);

        //drag mechanics
        img.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/icon-id", id);
            img.alive = false;
        });

        img.addEventListener("dragend", () => {
            if (img.datasetalive === "0") return; 
            img.alive = true;
            requestAnimationFrame(() => requestAnimationFrame(bounce)); 
        });
    }

    function spawnAll() { //loop spawnicon
        for (const [label, file] of Object.entries(iconlist)) spawnIcon(file, label);
    }

    //discern between do everything and other options when spawn icon
    document.body.addEventListener("change", (e) => {
        if (!e.target.classList.contains("dropdown")) return;
        const dd = e.target;
        everything(dd);
        scorecounter(dd);
        const value = dd.value;
        if (value === "Do Everything...") {
            spawnAll();
            return;
        }
        const file = iconlist[value];
        if (file) spawnIcon(file, value);
    });

    //insurance
    const dd = document.querySelector(".dropdown");
    if (dd) { 
        const obs = new MutationObserver(() => {
            if (dropdownReady(dd)) {
                everything(dd);
                scorecounter(dd);
            }
        });
        obs.observe(dd, { attributes: true, childList: true, attributeFilter: ["class", "disabled"] });
    }
});
