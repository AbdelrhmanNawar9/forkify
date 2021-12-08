import icons from 'url:../../img/icons.svg';

export class View {
  _data;

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();
    if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.slice().forEach((newEl, i) => {
      const curEl = curElements[i];

      //Update changed TEXT
      // changed elements and elements that contain text directly
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== '' // to eleminate containers and only choose elements that contain text directly
        // firstChild is textnode and nodeValue return the text content if the type of the node is textnode
      ) {
        curEl.textContent = newEl.textContent;
      }
      //Update changed ATTRIBUTE
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  renderSpinner() {
    this._clear();
    const markup = `<div class="spinner">
    <svg>
      <use href="${icons}#icon-loader"></use>
    </svg>
  </div>`;
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }
  renderError(message = this._errorMessage) {
    const markup = `<div class="error">
    <div>
    <svg>
    <use href="${icons}#icon-alert-triangle"></use>
    </svg>
    </div>
    <p>${message}</p>
    </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderMessage(message = this._message) {
    const markup = `<div class="message">
    <div>
    <svg>
    <use href="${icons}#icon-smile"></use>
    </svg>
    </div>
    <p>${message}</p>
    </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
