// ==UserScript==
// @name           FloatingScrollbar.uc.js
// @namespace      nightson1988@gmail.com
// @include        main
// @version        0.0.2
// @note           Thanks to Griever(https://github.com/Griever/userChromeJS/blob/master/SmartScrollbar.uc.js) and Paul Rouget(https://gist.github.com/4003205)
// @note           0.0.2 Remove usage of E4X (https://bugzilla.mozilla.org/show_bug.cgi?id=788293)
// ==/UserScript==

(function () {
    var prefs = Services.prefs,
        enabled;
    if (prefs.prefHasUserValue('userChromeJS.floating_scrollbar.enabled')) {
        enabled = prefs.getBoolPref('userChromeJS.floating_scrollbar.enabled');
    } else {
        prefs.setBoolPref('userChromeJS.floating_scrollbar.enabled', true);
        enabled = true;
    }
    var prefs2 = Services.prefs;
        prefs2.setIntPref('slider.snapMultiplier', 0);
        // 次回起動時から有効

    var css = '\
    @namespace html url("http://www.w3.org/1999/xhtml");\
    scrollbar {\
        background-color: transparent !important;\
//        padding: 1px !important;\
        margin: 1px !important;\
    }\
\
    scrollbar[orient="vertical"] > slider > thumb\
    {\
      max-width: 4px !important;\
      min-width: 4px !important;\
    }\
\
    scrollbar[orient="horizontal"] > slider > thumb\
    {\
      max-height: 4px !important;\
      min-height: 4px !important;\
    }\
\
    scrollbar > slider > thumb\
    {\
      -moz-appearance: none !important;\
      border: none !important;\
      background-color: #BBB !important;\
    }\
\
    scrollbar > slider > thumb:hover,\
    scrollbar > slider > thumb:active\
    {\
      -moz-appearance: none !important;\
      border: none !important;\
      background-color: #777 !important;\
    }\
\
    scrollbar > scrollbarbutton,\
    resizer\
    {\
      display: none !important;\
    }\
    ';

    var sss = Cc['@mozilla.org/content/style-sheet-service;1'].getService(Ci.nsIStyleSheetService);
    var uri = makeURI('data:text/css;charset=UTF=8,' + encodeURIComponent(css));

    var p = document.getElementById('devToolsSeparator');
    var m = document.createElement('menuitem');
    m.setAttribute('label', "Schwimmende Scrollbar");
    m.setAttribute('type', 'checkbox');
    m.setAttribute('autocheck', 'false');
    m.setAttribute('checked', enabled);
    p.parentNode.insertBefore(m, p);
    m.addEventListener('command', command, false);

    if (enabled) {
        sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);
    }

    function command() {
        if (sss.sheetRegistered(uri, sss.AGENT_SHEET)) {
            prefs.setBoolPref('userChromeJS.floating_scrollbar.enabled', false);
            sss.unregisterSheet(uri, sss.AGENT_SHEET);
            m.setAttribute('checked', false);
        } else {
            prefs.setBoolPref('userChromeJS.floating_scrollbar.enabled', true);
            sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);
            m.setAttribute('checked', true);
        }

        let root = document.documentElement;
        let display = root.style.display;
        root.style.display = 'none';
        window.getComputedStyle(root).display; // Flush
        root.style.display = display;
    }

})();