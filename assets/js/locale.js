let languageCode = 'de';
// Sprache des Browsers ermitteln

document.addEventListener('DOMContentLoaded', function() {
  if (typeof i18next !== 'undefined' && typeof i18nextHttpBackend !== 'undefined') {
    i18next
      .use(i18nextHttpBackend)
      .use(window.i18nextBrowserLanguageDetector)
      .init({
        lng: browserLanguage,
        fallbackLng: 'de',
        debug: true,
        i18nextHttpBackend: {
           loadPath: './locales/{{ns}}/{{lng}}/properties.json', //path has to be defined in 'assets/i18next/i18nextHttpBackend.js'; checkout readme.txt
        },
        ns: namespace
      }, function(err, t) {
        // call update content
        languageCode = i18next.language.split('-')[0];
        // languageCode = i18next.language;
        updateContent();
      })
      .then(() => {
        console.log('i18next initialized');
      })
      .catch((err) => {
        console.error('Error initializing i18next:', err);
      });
  } else {
    console.error('i18next wurde nicht geladen!');
  }
});

let browserLanguage = navigator.language.split('-')[0] || navigator.userLanguage.split('-')[0];
browserLanguage = getURLParameter('lng');
console.log("Browsersprache:", browserLanguage);

function updateContent() {

    let languages = i18next.t('languages', { returnObjects: true });
    let languageSelector = new LanguageSelector();
    for (let i = 0; i < languages.length; i++) {
        languageSelector.build(languages[i], i18next.language);
    }

    if (languages.includes(browserLanguage)) {
        // do nothing
    } else {
        languageCode = languages[0];
    }

    loadPoiLayer();

    document.title = i18next.t('title');
    document.getElementById('brand').innerHTML = i18next.t('brand');
    document.getElementById('routeModal').innerHTML = i18next.t('brand');
    document.getElementById('closeBtnAboutModal').innerHTML = i18next.t('closeBtn');
    document.getElementById('closeBtnLegendModal').innerHTML = i18next.t('closeBtn');
    document.getElementById('closeBtnFeatureModel').innerHTML = i18next.t('closeBtn');
    document.getElementById('languageSelectorA').innerHTML = i18next.t('language');
    document.getElementById('zoomSelectorSpan').innerHTML = i18next.t('zoom');
    document.getElementById('routeSelectorSpan').innerHTML = i18next.t('route');
    document.getElementById('poisSelectorSpan').innerHTML = i18next.t('pois');
    document.getElementById('downloadSelectorSpan').innerHTML = i18next.t('download');
    document.getElementById('poisPanelTitle').innerHTML = i18next.t('pois');
    document.getElementById('welcomeModelTitle').innerHTML = i18next.t('welcomeModelTitle');

    new ModalBuilder().build('aboutTabsHeader');
    new ModalBuilder().build('attributionModal');
    new ModalBuilder().build('disclaimerModal');
    new ModalBuilder().build('featuresModal');
    new ModalBuilder().build('routModalBody');
    new ModalBuilder().build('links');
    new ModalBuilder().build('expectModal');
    new ModalBuilder().build('aboutModal');
}

/**
Use this class to buildLanguageSelector
*/
class LanguageSelector {

    constructor() {
        // remove languageSelectorUl innerHTML before setting new
        document.getElementById('languageSelectorUl').innerHTML = '';
    }

    /**
    * need actual language to change behavior of li-tag,
    * don't allow onclick, if language is already chosen.
    */
    build(newLanguage, existingLanguage) {

        var newLi, targetElement, lng;
        lng = i18next.t(newLanguage);
        newLi = document.createElement('li');
        if (newLanguage === existingLanguage) {
          newLi.innerHTML = '<li>&nbsp;&nbsp;<i class="bi bi-translate"></i>&nbsp;&nbsp;' + lng + '</li>';
        } else {
          newLi.innerHTML = '<li><a href="#" data-toggle="collapse" data-target=".navbar-collapse.in" onclick="changeLanguage(\'' + newLanguage + '\')">&nbsp;&nbsp;<i class="bi bi-translate"></i>&nbsp;&nbsp;' + lng + '</a></li>';
        }
        targetElement = document.getElementById('languageSelectorUl');
        targetElement.appendChild(newLi);
    }

}

// Funktion zur Sprachumschaltung
function changeLanguage(language) {
    i18next.changeLanguage(language, (err, t) => {
        if (err) {
            return console.error('Error changing language:', err);
        }
        languageCode = i18next.language;
        updateContent();
//        console.log('Sprache geändert auf:', languageCode);
    });
}
