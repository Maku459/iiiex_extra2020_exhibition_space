const enableGA = () => {
    let gaInitialize = document.createElement('script');
    if (document.getElementById('gaInitialize') === null) {
        gaInitialize.setAttribute('id', 'gaInitialize');
        gaInitialize.innerHTML = `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());gtag('config', '${GA_MEASUREMENT_ID}', {
                      'linker': {
                        'domains': ['iiiexhibition.com', 'www.iiiexhibition.com']
                      }
                    });
                 `;
        document.head.appendChild(gaInitialize);
    }
    window['ga-disable-' + GA_MEASUREMENT_ID] = false;
};
const disableGA = () => {
    window['ga-disable-' + GA_MEASUREMENT_ID] = true;
    document.cookie = '_ga=; max-age=0';
    document.cookie = '_gid=; max-age=0';
    document.cookie = '_gat=; max-age=0';
    document.cookie = 'AMP_TOKEN=; max-age=0';
    document.cookie = '_gat_gtag_' + GA_MEASUREMENT_ID + '=; max-age=0';
    document.cookie = '__utma=; max-age=0';
    document.cookie = '__utmt=; max-age=0';
    document.cookie = '__utmb=; max-age=0';
    document.cookie = '__utmc=; max-age=0';
    document.cookie = '__utmz=; max-age=0';
    document.cookie = '__utmv=; max-age=0';
}

const deleteCookies = () => {
    document.cookie = '_myapp_session=; max-age=0';
}

const railsAgreeCookie = () => {
    $.ajax({
        type: "POST",
        url: "/users.json",
        data: JSON.stringify({"agreeCookie": true, "isExist": true}),
        dataType: "json",
        contentType: "application/json",
        error: function(e) {
            console.log(e);
        }
    });
}

const railsDisagreeCookie = () => {
    $.ajax({
        type: "POST",
        url: "/users.json",
        data: JSON.stringify({"agreeCookie": false, "isExist": true}),
        dataType: "json",
        contentType: "application/json",
        error: function(e) {
            console.log(e);
        }
    })
}

var language = (window.navigator.languages && window.navigator.languages[0]) ||
    window.navigator.language ||
    window.navigator.userLanguage ||
    window.navigator.browserLanguage;
let csMessageText = "This website uses cookies to ensure you get the best experience on our website.";
let csDismissText = "Got it!";
let csDenyText = "Decline"
let csAllowText = "Allow cookies";
let csLinkText = "Learn more";
if (language == 'ja') {
    csMessageText = "クッキーを利用しています．";
    csDismissText = "はい";
    csDenyText = "拒否する"
    csAllowText = "同意する";
    csLinkText = "クッキーポリシー";
}


window.cookieconsent.initialise({
    "palette": {
        "popup": {
            "background": "#eb6c44",
            "text": "#ffffff"
        },
        "button": {
            "background": "#f5d948"
        }
    },
    "theme": "classic",
    "position": "bottom-left",
    "type": "opt-in",
    "content": {
        "message": csMessageText,
        "dismiss": csDismissText,
        "deny": csDenyText,
        "allow": csAllowText,
        "link": csLinkText,
        "href": "https://www.iiiexhibition.com/cookiepolicy.html"
    },
    onInitialise: function (status) {
        var type = this.options.type;
        var didConsent = this.hasConsented();
        if (type == 'opt-in' && didConsent) {
            // enable cookies
            enableGA();
            railsAgreeCookie();
        }
        if (type == 'opt-out' && !didConsent) {
            // disable cookies
            disableGA();
            railsDisagreeCookie();
            deleteCookies();
        }
    },
    onStatusChange: function(status, chosenBefore) {
        var type = this.options.type;
        var didConsent = this.hasConsented();
        if (type == 'opt-in' && didConsent) {
            // enable cookies
            enableGA();
            railsAgreeCookie();
        }
        if (type == 'opt-out' && !didConsent) {
            // disable cookies
            disableGA();
            railsDisagreeCookie();
            deleteCookies();
        }
    },
    onRevokeChoice: function() {
        var type = this.options.type;
        if (type == 'opt-in') {
            // disable cookies
            disableGA();
            railsDisagreeCookie();
            deleteCookies();
        }
        if (type == 'opt-out') {
            // enable cookies
            enableGA();
            railsAgreeCookie();
        }
    }
});