import { LitElement, html } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import _ from 'lodash';

import { renderFonts, ensureFonts } from './lib/typography.js';
import { renderContents } from './lib/contents.js';

import fonts__suedtirol_next_woff from './fonts/SuedtirolNextTT.woff';
import fonts__suedtirol_next_woff2 from './fonts/SuedtirolNextTT.woff2';
import fonts__kievit_regular_woff from './fonts/Kievit.woff';
import fonts__kievit_bold_woff from './fonts/Kievit-Bold.woff';

import styles__normalize from 'normalize.css/normalize.css';
import styles from './contents.scss';

import assets__arrow_down_icon from './images/arrow-down.svg';

const fonts = [
  {
    name: 'pages-suedtirol-next',
    woff: fonts__suedtirol_next_woff,
    woff2: fonts__suedtirol_next_woff2,
    weight: 400
  },
  {
    name: 'pages-kievit',
    woff: fonts__kievit_regular_woff,
    weight: 400
  },
  {
    name: 'pages-kievit',
    woff: fonts__kievit_bold_woff,
    weight: 700
  }
];

class ContentsElement extends LitElement {

  constructor() {
    super();

    this.srcUrl = '';
    this.expandEnabled = 'true';
    this.expanded = 'false';
  }

  static get properties() {
    return {
      srcUrl: { attribute: 'src', type: String },
      expandEnabled: { attribute: 'expandable', type: String },
      expanded: { attribute: 'expanded', type: String }
    };
  }

  render() {
    return html`
      <style>
        ${renderFonts(fonts)}
        ${styles__normalize}
        ${styles}
      </style>
      <div id="container" class="${!!this.expandEnabled && this.expandEnabled === 'true' ? 'is-expandable' : '' } ${!!this.expanded && this.expanded === 'true' ? 'is-expanded' : 'is-collapsed' }">
        <div id="contains-contents">
          <div id="contents"></div>
          ${!!this.expandEnabled && this.expandEnabled === 'true' ? unsafeHTML`
            <div id="contains-expand">
              <div id="expand"></div>
            </div>
          ` : ``}
        </div>
      </div>
    `;
  }

  async firstUpdated() {
    let self = this;
    let root = self.shadowRoot;

    ensureFonts(fonts);

    if (!!self.srcUrl) {
      fetch(self.srcUrl).then((response) => {
        return response.json();
      }).then((data) => {
        let container = root.getElementById('container');

        let contentsElement = root.getElementById('contents');
        contentsElement.innerHTML = renderContents(data.contents || '');

        let expandElement = root.getElementById('expand');
        expandElement.innerHTML = assets__arrow_down_icon.replace(/#FFFFFF/g, '#758592');
        expandElement.addEventListener('click', (e) => {
          if (container.classList.contains('is-expanded')) {
            container.classList.add('is-collapsed');
            container.classList.remove('is-expanded');
          } else {
            container.classList.remove('is-collapsed');
            container.classList.add('is-expanded');
          }
        });
      });
    }
  }

}

if (!customElements.get('pages-contents')) {
  customElements.define('pages-contents', ContentsElement);
}