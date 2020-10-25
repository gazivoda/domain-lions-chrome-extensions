'use strict';
let textExists = false;
let modalExists = false;
let newElExists = false;
let email;
let phoneNumber;
let domain;
let leadList;
let currentLead;
let sellingDomain;


// NEW FORM 

if (window.location.href.includes('godaddy')) {

    var observer = new MutationObserver(function(mutations) {
        const text = document.querySelector("#whois-data");

        if (!newElExists && !!text && text.innerText !== '') {
            newElExists = true;
            debugger;
            setTimeout(crawlData(text, true), 500);
        }
    });
    observer.observe(document.body, { childList: true });

    // NEW FORM 

    var observer = new MutationObserver(function(mutations) {
        const text = document.querySelector("body > div.main-content.whois > div.content-layout.tile-section.bg-faint > div > div.result-column.col-lg-8.col-xs-12.col-sm-12 > div.whois-result.ux-card.card.content-card-mod > div > div:nth-child(1) > div > div.text");

        if (!textExists && !!text && text.closest('body')) {
            textExists = true;
            setTimeout(crawlData(text, false), 500);
        }
    });
    observer.observe(document.body, { childList: true });

    function crawlData(text, newCrawl) {
        email = text.innerText.split('Registrant Email: ').length && text.innerText.split('Registrant Email: ')[1] ? text.innerText.split('Registrant Email: ')[1].split("\n")[0] : '';
        phoneNumber = text.innerText.split('Registrant Phone: ') && text.innerText.split('Registrant Phone: ')[1] ? text.innerText.split('Registrant Phone: ')[1].split("\n")[0] : '';
        domain = text.innerText.split('Domain Name: ') && text.innerText.split('Domain Name: ')[1] ? text.innerText.split('Domain Name: ')[1].split("\n")[0] : '';
        console.log('@@@', email, phoneNumber, domain);
        if (domain === '') {
            domain = window.location.href.split('domain=')[1];
        }
        if (email.includes('domainsbyproxy')) {
            phoneNumber = '';
            email = '';
        }
        if (!email.includes('@')) {
            email = '';
            setTimeout(function() {
                let el = document.querySelector("body > div.main-content.whois > div.content-layout.tile-section.bg-faint > div > div.result-column.col-lg-8.col-xs-12.col-sm-12 > div.whois-result.ux-card.card.content-card-mod > div > div:nth-child(2) > div > div.contact-registrant-link.whois-link > a");
                let newEl = document.querySelector("#btn-contact-domain-holder");
                debugger;
                if (!newCrawl) {
                    openModal();
                }
                if (newCrawl) {
                    openNewModal();
                }

            }, 300);
        } else if (domain !== '') {
            fetchData();
        }
        else {
            // window.close();
        }

    }

    function fetchData() {

        let xhr = new XMLHttpRequest();

        xhr.open('GET', 'https://domainlions.com/getGoDaddyDomains', true);

        xhr.responseType = 'json';

        xhr.send();

        xhr.onload = function() {
            debugger;
            leadList = xhr.response;
            currentLead = leadList.find(listItem => listItem.domain.toLowerCase() === domain.toLowerCase());
            console.log('@@@ LEAD ', currentLead);

            updateLead({ ...currentLead, phoneNumber, email, noEmail: email.length > 0 ? false : true });
        };

    }

    function updateLead(lead) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", 'https://domainlions.com:8443/control/updateWhoisInfo');
        xhr.setRequestHeader('Content-Type', 'application/json');

        //Send the proper header information along with the request
        // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        xhr.onreadystatechange = function() { // Call a function when the state changes.
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                window.close();
                console.log('Request succeeded with JSON response', xhr.response);
            }
        }
        xhr.send(JSON.stringify(lead));
    }

    function openNewModal() {
        debugger;
        let el = document.querySelector("#btn-contact-domain-holder");

        if (el) {
            el.click();
            setTimeout(populateNewModal(''), 500);

        } else {
            let xhr = new XMLHttpRequest();
            xhr.open("GET", `https://domainlions.com:8443/control/getSellingDomainForGoDaddy?domain=${domain}`);
            xhr.responseType = 'text';

            xhr.send();

            xhr.onload = function() {
                window.close();
            };

        }




    }
    function openModal(element) {

        let el = document.querySelector("body > div.main-content.whois > div.content-layout.tile-section.bg-faint > div > div.result-column.col-lg-8.col-xs-12.col-sm-12 > div.whois-result.ux-card.card.content-card-mod > div > div:nth-child(2) > div > div.contact-registrant-link.whois-link > a");

        if (el) {
            el.click();
            let xhr = new XMLHttpRequest();
            xhr.open("GET", `https://domainlions.com:8443/control/getSellingDomainForGoDaddy?domain=${domain}`);
            xhr.responseType = 'text';

            xhr.send();

            xhr.onload = function() {
                sellingDomain = xhr.response;
                if (!!sellingDomain) {
                    setTimeout(populateModal(sellingDomain), 500);
                }
            };
        } else {
            let xhr = new XMLHttpRequest();
            xhr.open("GET", `https://domainlions.com:8443/control/getSellingDomainForGoDaddy?domain=${domain}`);
            xhr.responseType = 'text';

            xhr.send();

            xhr.onload = function() {
                window.close();
            };

        }

    }

    function populateNewModal(sellingDomain) {


        document.querySelector("#label-OTHER_PURPOSE").click()

        document.querySelector("#Your-Email-Address").value = "david@domainlions.net";

        watchForNewSubmit(false);
    }

    function populateModal(sellingDomain) {

        document.querySelector("#inputEmailAddress").value = "david@domainlions.net";


        let xhr = new XMLHttpRequest();
        xhr.open("GET", `https://domainlions.com:8443/control/getMessageForGoDaddy?domain=${domain}`);
        xhr.responseType = 'text';

        xhr.send();

        xhr.onload = function() {
            let message = xhr.response;
            document.querySelector("#inputContactReason").click();
            document.querySelector("#inputContactReason").value = message;
            document.querySelector("#inputContactReason").click();

            watchForSubmit(false);

        };

    }


    function watchForSubmit(elExist) {
        setTimeout(() => {
            const text = document.querySelector("#Registrant");
            if (!elExist && !!text && text.style.display !== 'none') {
                debugger;
                elExist = true;
                //    SUBMITED!!!
                let xhr = new XMLHttpRequest();
                xhr.open("GET", `https://domainlions.com:8443/control/setLeadAsDone?domain=${domain}`);
                xhr.responseType = 'text';

                xhr.send();

                xhr.onload = function() {
                    setTimeout(() => {
                        window.close();
                        return;
                    }, 500)
                };

            } else {
                watchForSubmit(false);
            }
        }, 200)
    }
    function watchForNewSubmit(elExist) {
        if (document.querySelector("#Your-Email-Address")) {
            document.querySelector("#Your-Email-Address").value = "david@domainlions.net";
        }
        setTimeout(() => {
            const text = document.querySelector("#GrowlMsg_0");
            if (!elExist && !!text) {
                debugger;
                elExist = true;
                //    SUBMITED!!!
                let xhr = new XMLHttpRequest();
                xhr.open("GET", `https://domainlions.com:8443/control/setLeadAsDone?domain=${domain}`);
                xhr.responseType = 'text';

                xhr.send();

                xhr.onload = function() {
                    setTimeout(() => {
                        window.close();
                        return;
                    }, 500)
                };

            } else {
                watchForNewSubmit(false);
            }
        }, 200)
    }


} else {

    // ****** FORMS SECTION


    const formValue = {
        name: 'David',
        lastName: 'Pavel',
        email: 'david@domainlions.net',
        phone: '16615059573',
        message: 'Hi we are selling similar domain Contact us',
        street: '2311 Almondwood Avenue,',
        zip: '93535',
        location: 'LA, USA',
        company: 'Domain Lions',
        subject: 'Similar Domain Available',
    }
    let formValueFilled = {
        name: false,
        lastName: false,
        email: false,
        phone: false,
        message: false,
        street: false,
        zip: false,
        location: false,
        company: false,
        subject: false,
        contact: false
    }

    let currentDomain = window.location.href.split('#').slice(-1)[0];
    debugger;

    let xhr = new XMLHttpRequest();
    xhr.open("GET", `https://domainlions.com:8443/control/getMessageForForm?domain=${currentDomain}`);
    xhr.responseType = 'text';

    xhr.send();

    xhr.onload = () => {
        formValue.message = xhr.response;
        formValue.subject = formValue.message.split('domain ')[1].split(' released back')[0] + ' sold';
        setTimeout(() => {
            loadForm();
        }, 2500);
    };
    let node = document.createElement('div');

    node.className = "dot";
    setTimeout(() => {
        node.className = "fade";
    }, 2500);



    document.getElementsByTagName("body")[0].appendChild(node);
    function KeyPress(e) {
        var evtobj = window.event ? event : e

        if (evtobj.keyCode == 27) {
            e.preventDefault();
            if (!escPressed) {
                let node = document.createElement('div');

                node.className = "dot green";
                setTimeout(() => {
                    node.className = "fade";
                }, 2500);
                document.getElementsByTagName("body")[0].appendChild(node);
            } else {
                node.className = "dot";
                setTimeout(() => {
                    node.className = "fade";
                }, 2500);


                document.getElementsByTagName("body")[0].appendChild(node);
            }
            escPressed = !escPressed;
        }

        if (evtobj.keyCode == 48 && !escPressed) {
            e.preventDefault();
            loadForm();
        }

        if (evtobj.keyCode == 49 && !escPressed) {
            e.preventDefault();
            e.target.value = formValue.name + ' ' + formValue.lastName;
        }
        if (evtobj.keyCode == 50 && !escPressed) {
            e.preventDefault();
            e.target.value = formValue.email;
        }
        if (evtobj.keyCode == 51 && !escPressed) {
            e.preventDefault();
            e.target.value = formValue.subject;
        }
        if (evtobj.keyCode == 52 && !escPressed) {
            e.preventDefault();
            e.target.value = formValue.message;
        }
        if (evtobj.keyCode == 53 && !escPressed) {
            e.preventDefault();
            e.target.value = formValue.phone;
        }
        if (evtobj.keyCode == 54 && !escPressed) {
            e.preventDefault();
            e.target.value = formValue.street + ' ' + formValue.zip + ' ' + formValue.location;
        }

    }


    let escPressed = false;
    document.onkeydown = KeyPress;


    function loadForm() {
        const forms = document.getElementsByTagName("form");

        const lastNameStrings = ['last', 'nachname', 'apellido', 'famil', 'lastname', 'prenom', 'prénom'];
        const nameStrings = ['name', 'nom', 'nombre', 'naam', 'first', 'surname'];
        const emailStrings = ['email', 'mail'];
        const phoneStrings = ['phone', 'telephone', 'number', 'telefon', 'handy', 'tel', 'fax'];
        const messageStrings = ['message', 'comment', 'nachricht', 'bericht', 'msg'];
        const streetStrings = ['street', 'strasse', 'rue', 'address'];
        const zipStrings = ['zip', 'code', 'postcode', 'plz'];
        const locationStrings = ['location', 'place', 'city', 'state', 'ort', 'ville'];
        const companyStrings = ['company', 'firm', 'entreprise', 'unternehmen'];
        const subjectStrings = ['subject', 'title', 'topic', 'objet'];
        const contactStrings = ['person'];


        for (let i = 0;i < forms.length;i++) {
            let inputFields = [...forms[i].getElementsByTagName("input"), ...forms[i].getElementsByTagName("textarea")];
            formValueFilled = {
                name: false,
                lastName: false,
                email: false,
                phone: false,
                message: false,
                street: false,
                zip: false,
                location: false,
                company: false,
                subject: false,
                contact: false
            }
            let withLastName = false;
            let inputFieldsNoLastName = [];

            inputFields.map(field => {
                let filled = false;
                lastNameStrings.forEach(string => {
                    if ((field.ariaLabel && field.ariaLabel.toLowerCase().includes(string)) || field.name.toLowerCase().includes(string) || field.placeholder.toLowerCase().includes(string) || field.id.toLowerCase().includes(string) || field.className.toLowerCase().includes(string) || field.outerHTML.toLowerCase().includes(string)) {
                        field.value = formValue.lastName;
                        withLastName = true;
                        formValueFilled.lastName = true;
                        filled = true;
                    }
                });
                if (!filled) {
                    inputFieldsNoLastName.push(field);
                }
            });

            for (let i = 0;i < inputFieldsNoLastName.length;i++) {
                debugger;
                if (inputFieldsNoLastName[i].type !== "submit" && inputFieldsNoLastName[i].type !== "button" && inputFieldsNoLastName[i].type !== "hidden") {
                    patchFieldValue(inputFieldsNoLastName[i], withLastName);
                }
            }

            const selectFields = forms[i].getElementsByTagName("select");

            for (let i = 0;i < selectFields.length;i++) {
                patchSelect(selectFields[i]);
            }

        }

        function patchSelect(field) {
            if (!field.value && field.options[1]) {
                field.value = field.options[1].value;
            }
        }


        function patchFieldValue(field, withLastName) {
            let fieldPatched = false;

            nameStrings.forEach(string => {
                if (!fieldPatched && !formValueFilled.name && ((field.ariaLabel && field.ariaLabel.toLowerCase().includes(string)) || field.name.toLowerCase().includes(string) || field.className.toLowerCase().includes(string) || field.placeholder.toLowerCase().includes(string) || field.id.toLowerCase().includes(string))) {
                    if (withLastName) {
                        field.value = formValue.name;
                    } else {
                        field.value = formValue.name + ' ' + formValue.lastName;
                    }
                    fieldPatched = true;
                    formValueFilled.name = true;
                }
            });

            contactStrings.forEach(string => {
                if (!fieldPatched && !formValueFilled.contact && ((field.ariaLabel && field.ariaLabel.toLowerCase().includes(string)) || field.name.toLowerCase().includes(string) || field.className.toLowerCase().includes(string) || field.placeholder.toLowerCase().includes(string) || field.id.toLowerCase().includes(string) || field.outerHTML.toLowerCase().includes(string))) {
                    field.value = formValue.name + ' ' + formValue.lastName;
                    fieldPatched = true;
                    formValueFilled.contact = true;
                }
            });

            emailStrings.forEach(string => {
                if (!fieldPatched && !formValueFilled.email && ((field.ariaLabel && field.ariaLabel.toLowerCase().includes(string)) || field.name.toLowerCase().includes(string) || field.className.toLowerCase().includes(string) || field.type.toLowerCase().includes('email') || field.id.toLowerCase().includes(string) || field.placeholder.toLowerCase().includes(string) || field.outerHTML.toLowerCase().includes(string))) {
                    field.value = formValue.email;
                    fieldPatched = true;
                    formValueFilled.email = true;
                }
            });

            phoneStrings.forEach(string => {
                if (!fieldPatched && !formValueFilled.phone && ((field.ariaLabel && field.ariaLabel.toLowerCase().includes(string)) || field.name.toLowerCase().includes(string) || field.className.toLowerCase().includes(string) || field.type.toLowerCase().includes('tel') || field.id.toLowerCase().includes(string) || field.placeholder.toLowerCase().includes(string) || field.outerHTML.toLowerCase().includes(string))) {
                    field.value = formValue.phone;
                    fieldPatched = true;
                    formValueFilled.phone = true;
                }
            });

            messageStrings.forEach(string => {
                if (!fieldPatched && !formValueFilled.message && ((field.ariaLabel && field.ariaLabel.toLowerCase().includes(string)) || field.name.toLowerCase().includes(string) || field.className.toLowerCase().includes(string) || field.id.toLowerCase().includes(string) || field.type.toLowerCase().includes('textarea') || field.placeholder.toLowerCase().includes(string) || field.outerHTML.toLowerCase().includes(string))) {
                    field.value = formValue.message;
                    fieldPatched = true;
                    // formValueFilled.message = true;
                }
            });

            streetStrings.forEach(string => {
                if (!fieldPatched && !formValueFilled.street && ((field.ariaLabel && field.ariaLabel.toLowerCase().includes(string)) || field.name.toLowerCase().includes(string) || field.className.toLowerCase().includes(string) || field.id.toLowerCase().includes(string) || field.placeholder.toLowerCase().includes(string) || field.outerHTML.toLowerCase().includes(string))) {
                    field.value = formValue.street;
                    fieldPatched = true;
                    formValueFilled.street = true;
                }
            });

            zipStrings.forEach(string => {
                if (!fieldPatched && !formValueFilled.zip && ((field.ariaLabel && field.ariaLabel.toLowerCase().includes(string)) || field.name.toLowerCase().includes(string) || field.className.toLowerCase().includes(string) || field.id.toLowerCase().includes(string) || field.placeholder.toLowerCase().includes(string) || field.outerHTML.toLowerCase().includes(string))) {
                    field.value = formValue.zip;
                    fieldPatched = true;
                    formValueFilled.zip = true;
                }
            });

            locationStrings.forEach(string => {
                if (!fieldPatched && !formValueFilled.location && ((field.ariaLabel && field.ariaLabel.toLowerCase().includes(string)) || field.name.toLowerCase().includes(string) || field.className.toLowerCase().includes(string) || field.id.toLowerCase().includes(string) || field.placeholder.toLowerCase().includes(string))) {
                    field.value = formValue.location;
                    fieldPatched = true;
                    formValueFilled.location = true;
                }
            });

            companyStrings.forEach(string => {
                if (!fieldPatched && !formValueFilled.company && ((field.ariaLabel && field.ariaLabel.toLowerCase().includes(string)) || field.name.toLowerCase().includes(string) || field.className.toLowerCase().includes(string) || field.id.toLowerCase().includes(string) || field.placeholder.toLowerCase().includes(string) || field.outerHTML.toLowerCase().includes(string))) {
                    field.value = formValue.company;
                    fieldPatched = true;
                    formValueFilled.company = true;
                }
            });

            subjectStrings.forEach(string => {
                if (!fieldPatched && !formValueFilled.subject && ((field.ariaLabel && field.ariaLabel.toLowerCase().includes(string)) || field.name.toLowerCase().includes(string) || field.className.toLowerCase().includes(string) || field.id.toLowerCase().includes(string) || field.placeholder.toLowerCase().includes(string) || field.outerHTML.toLowerCase().includes(string))) {
                    field.value = formValue.subject;
                    fieldPatched = true;
                    formValueFilled.subject = true;
                }
            });



            if (!fieldPatched && field.required && field.type === 'number') {
                field.value = formValue.phone;
                fieldPatched = true;
            }

        }

    }
}
