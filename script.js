const MoneySpan = document.getElementById('mspn'),
    SaveButton = document.getElementById('sbtn'),
    TextSpans = document.getElementsByClassName('tspn'),
    BuyButtons = document.getElementsByClassName('bbtn'),
    RentButtons = document.getElementsByClassName('rbtn'),
    ManageButtons = document.getElementsByClassName('mbtn'),
    RentProgresses = document.getElementsByClassName('pbar'),
    PropertyAssets = [
        { level: 0, time: 3, rent: 2, cost: 5, inc: 1.05, intID: -1, auto: false },
        { level: 0, time: 6, rent: 5, cost: 10, inc: 1.05, intID: -1, auto: false },
        { level: 0, time: 9, rent: 10, cost: 20, inc: 1.05, intID: -1, auto: false },
        { level: 0, time: 12, rent: 20, cost: 40, inc: 1.05, intID: -1, auto: false },
        { level: 0, time: 15, rent: 40, cost: 80, inc: 1.05, intID: -1, auto: false },
        { level: 0, time: 18, rent: 80, cost: 160, inc: 1.05, intID: -1, auto: false },
        { level: 0, time: 21, rent: 160, cost: 320, inc: 1.05, intID: -1, auto: false },
        { level: 0, time: 24, rent: 320, cost: 640, inc: 1.05, intID: -1, auto: false },
        { level: 0, time: 27, rent: 640, cost: 1280, inc: 1.05, intID: -1, auto: false },
        { level: 0, time: 30, rent: 1280, cost: 2560, inc: 1.05, intID: -1, auto: false },
        { level: 0, time: 33, rent: 2560, cost: 5120, inc: 1.05, intID: -1, auto: false },
        { level: 0, time: 36, rent: 5120, cost: 10240, inc: 1.05, intID: -1, auto: false },
        { level: 0, time: 39, rent: 10240, cost: 20480, inc: 1.05, intID: -1, auto: false },
        { level: 0, time: 42, rent: 20480, cost: 40960, inc: 1.05, intID: -1, auto: false },
        { level: 0, time: 45, rent: 40960, cost: 81920, inc: 1.05, intID: -1, auto: false },
        { level: 0, time: 48, rent: 81920, cost: 163840, inc: 1.05, intID: -1, auto: false },
        { level: 0, time: 51, rent: 163840, cost: 327680, inc: 1.05, intID: -1, auto: false, },
        { level: 0, time: 54, rent: 327680, cost: 655360, inc: 1.05, intID: -1, auto: false },
        { level: 0, time: 57, rent: 655360, cost: 1310720, inc: 1.05, intID: -1, auto: false },
        { level: 0, time: 60, rent: 1310720, cost: 2621440, inc: 1.05, intID: -1, auto: false },
        8,
    ],
    SaveRequest = window.indexedDB.open('save-game');

SaveRequest.onupgradeneeded = (e) => SaveRequest.result.createObjectStore('SaveFile0', { autoIncrement: true });
SaveRequest.onsuccess = (e) => {
    const files = e.target.result.transaction('SaveFile0').objectStore('SaveFile0').getAll();
    files.onerror = (e) => window.init();
    files.onsuccess = (e) => {
        if (e.target.result.length) {
            const save = e.target.result.pop();
            if (Array.isArray(save)) {
                PropertyAssets.length = 0;
                PropertyAssets.push(...save);
            }
        } window.init();
    };
};

function init() {
    MoneySpan.innerText = `$${PropertyAssets[20].toFixed(2)}`;
    for (let i = 0; i < 20; i++) {
        SaveButton.addEventListener('click', save);
        BuyButtons[i].addEventListener('click', buy);
        RentButtons[i].addEventListener('click', rent);
        ManageButtons[i].addEventListener('click', manage);
        TextSpans[i].innerText = `${PropertyAssets[i].rent} x ${PropertyAssets[i].level} - ${PropertyAssets[i].cost.toFixed(2)} : ${PropertyAssets[i].time}`;
        if (PropertyAssets[i].level) {
            if (!PropertyAssets[i].auto) {
                ManageButtons[i].style.visibility = 'visible';
                RentButtons[i].style.visibility = 'visible';
                RentProgresses[i].style.visibility = 'hidden';
                RentProgresses[i].value = 0;
            } else {
                ManageButtons[i].style.display = 'none';
                RentButtons[i].style.display = 'none';
                BuyButtons[i].parentElement.style.justifyContent = 'center';
                RentProgresses[i].style.visibility = 'visible';
                let tmp = 0;
                PropertyAssets[i].intID = window.setInterval(() => {
                    tmp += 0.1;
                    RentProgresses[i].value = tmp;
                    if (tmp > PropertyAssets[i].time) {
                        tmp = 0;
                        RentProgresses[i].value = tmp;
                        PropertyAssets[20] += PropertyAssets[i].rent * PropertyAssets[i].level;
                        MoneySpan.innerText = `$${PropertyAssets[20].toFixed(2)}`;
                    }
                }, 100);
            }
        } else {
            ManageButtons[i].style.visibility = 'hidden';
            RentButtons[i].style.visibility = 'hidden';
            RentProgresses[i].style.visibility = 'hidden';
            RentProgresses[i].value = 0;
        }
    }
}

function showError(errtxt, intval) {
    MoneySpan.innerText = errtxt;
    const timID = window.setTimeout(() => {
        window.clearTimeout(timID);
        MoneySpan.innerText = `$${PropertyAssets[20].toFixed(2)}`;
    }, intval * 1000);
}

const save = function (e) {
    const store = SaveRequest.result
        .transaction('SaveFile0', 'readwrite')
        .objectStore('SaveFile0');
    store.clear().onsuccess = (e) => store.add(PropertyAssets);
}

const buy = function (e) {
    const ref = e.target.dataset.reff;
    if (PropertyAssets[20] < PropertyAssets[ref].cost)
        window.showError('Not Enough Money!', 1);
    else {
        PropertyAssets[ref].level++;
        PropertyAssets[20] -= PropertyAssets[ref].cost;
        PropertyAssets[ref].cost *= PropertyAssets[ref].inc;
        PropertyAssets[ref].inc += 0.05;
        MoneySpan.innerText = `$${PropertyAssets[20].toFixed(2)}`;
        TextSpans[ref].innerText = `${PropertyAssets[ref].rent} x ${PropertyAssets[ref].level} - ${PropertyAssets[ref].cost.toFixed(2)} : ${PropertyAssets[ref].time}`;
        if (PropertyAssets[ref].level == 1) {
            RentButtons[ref].style.visibility = 'visible';
            ManageButtons[ref].style.visibility = 'visible';
        }
    }
}

const rent = function (e) {
    const ref = e.target.dataset.reff;
    RentButtons[ref].style.visibility = 'hidden';
    BuyButtons[ref].style.visibility = 'hidden';
    ManageButtons[ref].style.visibility = 'hidden';
    RentProgresses[ref].style.visibility = 'visible';
    TextSpans[ref].innerText = 'Please Wait!';
    let tmp = 0;
    PropertyAssets[ref].intID = window.setInterval(() => {
        tmp += 0.1;
        RentProgresses[ref].value = tmp;
        if (tmp > PropertyAssets[ref].time) {
            window.clearInterval(PropertyAssets[ref].intID);
            PropertyAssets[20] +=
                PropertyAssets[ref].rent * PropertyAssets[ref].level;
            RentProgresses[ref].style.visibility = 'hidden';
            RentProgresses[ref].value = 0;
            TextSpans[ref].innerText = `${PropertyAssets[ref].rent} x ${PropertyAssets[ref].level} - ${PropertyAssets[ref].cost.toFixed(2)} : ${PropertyAssets[ref].time}`;
            MoneySpan.innerText = `$${PropertyAssets[20].toFixed(2)}`;
            RentButtons[ref].style.visibility = 'visible';
            BuyButtons[ref].style.visibility = 'visible';
            ManageButtons[ref].style.visibility = 'visible';
        }
    }, 100);
}

const manage = function (e) {
    const ref = e.target.dataset.reff;
    if (PropertyAssets[20] < PropertyAssets[ref].rent * 20)
        window.showError('Not Enough Money!', 1);
    else {
        PropertyAssets[20] -= PropertyAssets[ref].rent * 20;
        PropertyAssets[ref].auto = true;
        ManageButtons[ref].style.display = 'none';
        RentButtons[ref].style.display = 'none';
        BuyButtons[ref].parentElement.style.justifyContent = 'center';
        RentProgresses[ref].style.visibility = 'visible';
        MoneySpan.innerText = `$${PropertyAssets[20].toFixed(2)}`;
        let tmp = 0;
        PropertyAssets[ref].intID = window.setInterval(() => {
            tmp += 0.1;
            RentProgresses[ref].value = tmp;
            if (tmp > PropertyAssets[ref].time) {
                tmp = 0;
                RentProgresses[ref].value = tmp;
                PropertyAssets[20] +=
                    PropertyAssets[ref].rent * PropertyAssets[ref].level;
                MoneySpan.innerText = `$${PropertyAssets[20].toFixed(2)}`;
            }
        }, 100);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
