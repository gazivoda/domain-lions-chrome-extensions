'use strict';
let domainName = '';
let firstName = '';
let message = 'NO MESSAGE';
let escPressed = false;

function getDomainName() {
    const body = document.getElementsByTagName("body")[0];
    debugger;
    body.addEventListener('mousemove', e => {
        const bodySplit = body.innerText.split('Someone is trying to contact you regarding ')[1];
        if (!!bodySplit) {
            debugger;
            const newDomainName = bodySplit.split('.')[0] + '.' + bodySplit.split('.')[1];
            if (newDomainName !== domainName) {
                domainName = newDomainName;
                fetchMessage();
            }

        }

    });
}
getDomainName();

function fetchMessage() {

    firstName = document.querySelector("span.gD").innerText.split(' ')[0];
    if (!/^[a-zA-Z]+$/.test(firstName)) {
        firstName = '';
    };

    let domainNamePurified = domainName;

    if (domainNamePurified.includes('//')) {
        domainNamePurified = domainName.split('//')[1].replace('/', '');
    }

    let xhr = new XMLHttpRequest();

    let url = 'https://domainlions.com:8443/control/getMessageForReply?domain=' + domainNamePurified;
    if (!!firstName) {
        url = url + '&name=' + firstName;
    }
    xhr.open('GET', url, true);

    xhr.responseType = 'text';

    xhr.send();

    xhr.onload = function() {
        message = xhr.response;

        const el = document.createElement('textarea');
        el.value = message;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);

        navigator.clipboard.writeText(message)
            .then(() => {
                // Success!
            })
            .catch(err => {
                console.log('Something went wrong', err);
            });

    };
}

document.oncontextmenu = function clickListener(e) {
    debugger;
    let newDomainName;

    let textSelection = window.getSelection().toString();

    if (textSelection) {
        domainName = textSelection;
    } else {
        if (e.target.tagName.toLowerCase() === 'a') {
            newDomainName = e.target.href;
        } else {
            newDomainName = e.target.outerHTML;
            if (newDomainName) {
                newDomainName = newDomainName.split('//')[2];
                if (newDomainName) {
                    newDomainName = newDomainName.split('&')[0];
                }
            }
        }

        if (!newDomainName) {
            const arr = e.target.innerText.split(' ');
            if (arr.length > 1) {
                domainName = arr.find(i => i.includes('.'))
            } else {
                domainName = e.target.innerText;
            }
        }
        if (newDomainName !== domainName) {
            domainName = newDomainName;
        }

    }

    fetchMessage();
}

document.onkeydown = function keyListener(e) {
    debugger;
    if (e.metaKey && e.keycode === 86) {
        e.target.value = message;
    }

}