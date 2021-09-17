/*
VelJs is Velocity JavaScript by CharlesLana
A library that automates some features and returns feedback to the user
*/

class Vel {
  constructor(language = Vel.feedbackLanguage.en) {
    this.#feedbackLanguage = language;
  }

  #feedbackLanguage;
  object;
  listObject = [];
  callback;
  #maskRemoveSpecialCharacters = /[^A-zÀ-ú0-9_\s]/gi;
  url = '';
  extensionPath = 'html';
  loading = 'Loading...';
  isHash = true;
  data;

  static feedbackLanguage = {
    en: 'en',
    pt: 'pt',
  };

  static typeCallback = {
    text: 'text',
    image: 'image',
    style: {
      color: 'color',
      display: 'display',
      backgroundColor: 'backgroundColor',
      zIndex: 'zIndex',
      backgroundImage: 'backgroundImage',
      fontSize: 'fontSize',
      fontWeight: 'fontWeight',
      height: 'height',
      width: 'width',
      visibility: 'visibility',
      opacity: 'opacity',
    },
    click: 'click',
  };

  static methodFetchData = {
    get: 'GET',
    post: 'POST',
    put: 'PUT',
  };

  async fetchData(method) {
    this.#checkObjectNotNull(method);
    await fetch(this.url, { method: method })
      .then((response) => {
        if (!response.ok) {
          throw new Error(this.#exceptionErrorMessage('failedAPI'));
        }
        return response.json();
      })
      .then((data) => {
        this.data = data;
      })
      .catch((error) => {
        this.#messageError(error.message);
      });
  }

  async routePage(path) {
    this.#checkObjectNotNull(path);
    this.#checkObjectNotFound();
    const element = document.querySelectorAll(`[id="${this.object}"]`);
    this.#checkMultipleId(element);
    element[0].innerHTML = this.loading;
    await fetch(`${this.url}${path}.${this.extensionPath}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(this.#exceptionErrorMessage('failedAPI'));
        }
        return response.text();
      })
      .then((data) => {
        element[0].innerHTML = data;
        if (this.isHash) {
          window.location.hash = `#/${path}`;
        }
      })
      .catch((error) => {
        element[0].innerHTML = error.message;
        this.#messageError(error.message);
      });
  }

  getId(object) {
    this.#checkObjectNotNull(object);
    const element = document.querySelectorAll(`[id="${object}"]`);
    this.#checkMultipleId(element);
    return this.#getCallback(element[0]);
  }

  setId(object) {
    this.#checkObjectNotNull(object);
    this.#checkObjectNotFound();
    const element = document.querySelectorAll(`[id="${object}"]`);
    this.#checkMultipleId(element);
    this.#setCallback(element[0], this.object);
  }

  getListId(listObject) {
    this.#checkIsArray(listObject);
    const newListObject = [];
    listObject.forEach((value) => {
      this.#checkObjectNotNull(value);
      let element = document.querySelectorAll(`[id="${value}"]`);
      this.#checkMultipleId(element);
      element.forEach((value) => {
        newListObject.push(this.#getCallback(value));
      });
    });
    return newListObject;
  }

  setListId(listObject) {
    this.#checkIsArray(listObject);
    this.#checkObjectListNotFound(listObject);
    listObject.forEach((value, indexListObject) => {
      this.#checkObjectNotNull(value);
      let element = document.querySelectorAll(`[id="${value}"]`);
      this.#checkMultipleId(element);
      element.forEach((value, index) => {
        this.#setCallback(element[index], this.listObject[indexListObject]);
      });
    });
  }

  getOnlyClass(object) {
    this.#checkObjectNotNull(object);
    const element = document.querySelectorAll(
      `.${object.replace(this.#maskRemoveSpecialCharacters, '')}`
    );
    this.#checkMultipleClass(element);
    return this.#getCallback(element[0]);
  }

  setOnlyClass(object) {
    this.#checkObjectNotNull(object);
    this.#checkObjectNotFound();
    const element = document.querySelectorAll(
      `.${object.replace(this.#maskRemoveSpecialCharacters, '')}`
    );
    this.#checkMultipleClass(element);
    this.#setCallback(element[0], this.object);
  }

  getMultipleClass(object) {
    this.#checkObjectNotNull(object);
    const element = document.querySelectorAll(
      `.${object.replace(this.#maskRemoveSpecialCharacters, '')}`
    );
    this.#checkClassNotFound(element);
    const listObject = [];
    element.forEach((value) => {
      listObject.push(this.#getCallback(value));
    });
    return listObject;
  }

  setMultipleClass(object) {
    this.#checkObjectNotNull(object);
    this.#checkObjectNotFound();
    const element = document.querySelectorAll(
      `.${object.replace(this.#maskRemoveSpecialCharacters, '')}`
    );
    this.#checkClassNotFound(element);
    element.forEach((value, index) => {
      this.#setCallback(element[index], this.object);
    });
  }

  getListClass(listObject) {
    this.#checkIsArray(listObject);
    const newListObject = [];
    listObject.forEach((value) => {
      this.#checkObjectNotNull(value);
      let element = document.querySelectorAll(
        `.${value.replace(this.#maskRemoveSpecialCharacters, '')}`
      );
      this.#checkMultipleClass(element);
      element.forEach((value) => {
        newListObject.push(this.#getCallback(value));
      });
    });
    return newListObject;
  }

  setListClass(listObject) {
    this.#checkIsArray(listObject);
    this.#checkObjectListNotFound(listObject);
    listObject.forEach((value, indexListObject) => {
      this.#checkObjectNotNull(value);
      let element = document.querySelectorAll(
        `.${value.replace(this.#maskRemoveSpecialCharacters, '')}`
      );
      this.#checkMultipleClass(element);
      element.forEach((value, index) => {
        this.#setCallback(element[index], this.listObject[indexListObject]);
      });
    });
  }

  #getCallback(element) {
    let result;
    switch (this.callback) {
      case Vel.typeCallback.text:
        result = element.textContent;
        return result;
      case Vel.typeCallback.image:
        result = element.src;
        if (result == undefined) {
          const resultUndefined =
            this.#exceptionErrorMessage('resultUndefined');
          this.#messageError(resultUndefined);
        }
        return result;
      default:
        const callbackNotFound =
          this.#exceptionErrorMessage('callbackNotFound');
        this.#messageError(callbackNotFound);
    }
  }

  #setCallback(element, value) {
    switch (this.callback) {
      case Vel.typeCallback.text:
        element.innerHTML = value;
        break;
      case Vel.typeCallback.image:
        if (!element.hasAttribute('src')) {
          const hasAttributeSrc =
            this.#exceptionErrorMessage('hasAttributeSrc');
          this.#messageError(hasAttributeSrc);
        }
        element.src = value;
        break;
      case Vel.typeCallback.style.color:
        element.style.color = value;
        break;
      case Vel.typeCallback.style.display:
        element.style.display = value;
        break;
      case Vel.typeCallback.style.backgroundColor:
        element.style.backgroundColor = value;
        break;
      case Vel.typeCallback.style.zIndex:
        element.style.zIndex = value;
        break;
      case Vel.typeCallback.style.backgroundImage:
        element.style.backgroundImage = `url(${value})`;
        break;
      case Vel.typeCallback.style.fontSize:
        element.style.fontSize = value;
        break;
      case Vel.typeCallback.style.fontWeight:
        element.style.fontWeight = value;
        break;
      case Vel.typeCallback.style.height:
        element.style.height = value;
        break;
      case Vel.typeCallback.style.width:
        element.style.width = value;
        break;
      case Vel.typeCallback.style.visibility:
        element.style.visibility = value;
        break;
      case Vel.typeCallback.style.opacity:
        element.style.opacity = value;
        break;
      case Vel.typeCallback.click:
        if (typeof value != 'function') {
          const notFunction = this.#exceptionErrorMessage('notFunction');
          this.#messageError(notFunction);
        }
        element.addEventListener('click', value);
        break;
      default:
        const callbackNotFound =
          this.#exceptionErrorMessage('callbackNotFound');
        this.#messageError(callbackNotFound);
    }
  }

  #checkObjectListNotFound(listObject) {
    if (this.listObject.length != listObject.length) {
      const objectEqualNotFound = this.#exceptionErrorMessage(
        'objectEqualNotFound'
      );
      this.#messageError(objectEqualNotFound);
    }
    this.listObject.forEach((value) => {
      if (this.isEmpty(value) && typeof value != 'function') {
        const objectNotFound = this.#exceptionErrorMessage('objectNotFound');
        this.#messageError(objectNotFound);
      }
    });
    listObject.forEach((value) => {
      if (this.isEmpty(value) && typeof value != 'function') {
        const objectNotFound = this.#exceptionErrorMessage('objectNotFound');
        this.#messageError(objectNotFound);
      }
    });
  }

  #checkIsArray(object) {
    if (!Array.isArray(object)) {
      const objectNotArray = this.#exceptionErrorMessage('objectNotArray');
      this.#messageError(objectNotArray);
    }
  }

  #checkClassNotFound(element) {
    if (!element.length) {
      const classNotFound = this.#exceptionErrorMessage('classNotFound');
      this.#messageError(classNotFound);
    }
  }

  #checkObjectNotNull(object) {
    if (this.isEmpty(object)) {
      const notNull = this.#exceptionErrorMessage('notNull');
      this.#messageError(notNull);
    }
  }

  #checkObjectNotFound() {
    if (this.isEmpty(this.object) && typeof this.object != 'function') {
      const objectNotFound = this.#exceptionErrorMessage('objectNotFound');
      this.#messageError(objectNotFound);
    }
  }

  #checkMultipleId(element) {
    if (!element.length) {
      const idNotFound = this.#exceptionErrorMessage('idNotFound');
      this.#messageError(idNotFound);
    }
    if (element.length > 1) {
      const multipleIds = this.#exceptionErrorMessage('multipleIds');
      this.#messageError(multipleIds);
    }
  }

  #checkMultipleClass(element) {
    this.#checkClassNotFound(element);
    if (element.length > 1) {
      const multipleClasses = this.#exceptionErrorMessage('multipleClasses');
      this.#messageError(multipleClasses);
    }
  }

  isEmpty(string) {
    return !string || string.length === 0;
  }

  isBlank(string) {
    return !string || /^\s*$/.test(string);
  }

  #messageError(message) {
    if (this.#feedbackLanguage == Vel.feedbackLanguage.en) {
      alert(`Error\nMessage: ${message}`);
    } else {
      alert(`Erro\nMensagem: ${message}`);
    }
    this.#exception(message);
  }

  #exception(message) {
    throw new Error(message);
  }

  #exceptionErrorMessage(message) {
    switch (message) {
      case 'notNull':
        if (this.#feedbackLanguage == Vel.feedbackLanguage.en) {
          return 'The field cannot be null, it must inform a parameter.';
        }
        return 'O campo não pode ser nulo, deve informar um parâmetro.';
      case 'objectNotArray':
        if (this.#feedbackLanguage == Vel.feedbackLanguage.en) {
          return 'Enter only a list of objects.';
        }
        return 'Insira apenas uma lista de objetos.';
      case 'idNotFound':
        if (this.#feedbackLanguage == Vel.feedbackLanguage.en) {
          return 'Id not found.';
        }
        return 'Id não encontrado.';
      case 'multipleIds':
        if (this.#feedbackLanguage == Vel.feedbackLanguage.en) {
          return 'There are one or more IDs with the same key, check the document.';
        }
        return 'Existem um ou mais IDs com a mesma chave, verifique o documento.';
      case 'objectNotFound':
        if (this.#feedbackLanguage == Vel.feedbackLanguage.en) {
          return 'You must set a object with the object property.';
        }
        return 'Você deve definir um objeto com a propriedade do objeto.';
      case 'classNotFound':
        if (this.#feedbackLanguage == Vel.feedbackLanguage.en) {
          return 'Class not found.';
        }
        return 'Classe não encontrada.';
      case 'multipleClasses':
        if (this.#feedbackLanguage == Vel.feedbackLanguage.en) {
          return 'There are one or more Classes with the same key, check the document.';
        }
        return 'Existem uma ou mais Classes com a mesma chave, verifique o documento.';
      case 'objectEqualNotFound':
        if (this.#feedbackLanguage == Vel.feedbackLanguage.en) {
          return 'The list of objects must be the same as the parameter entered.';
        }
        return 'A lista de objetos deve ser igual ao parâmetro inserido.';
      case 'callbackNotFound':
        if (this.#feedbackLanguage == Vel.feedbackLanguage.en) {
          return 'Callback type not found or not entered.';
        }
        return 'Tipo de retorno de chamada não encontrado ou não inserido.';
      case 'hasAttributeSrc':
        if (this.#feedbackLanguage == Vel.feedbackLanguage.en) {
          return 'There is no src attribute on the element.';
        }
        return 'Não há atributo src no elemento.';
      case 'resultUndefined':
        if (this.#feedbackLanguage == Vel.feedbackLanguage.en) {
          return 'Callback result is undefined.';
        }
        return 'O resultado do retorno de chamada é indefinido.';
      case 'notFunction':
        if (this.#feedbackLanguage == Vel.feedbackLanguage.en) {
          return 'Object is not a function.';
        }
        return 'O objeto não é uma função.';
      case 'failedAPI':
        if (this.#feedbackLanguage == Vel.feedbackLanguage.en) {
          return 'Failed to load date from API.';
        }
        return 'Falha ao carregar data da API.';
      default:
        if (this.#feedbackLanguage == Vel.feedbackLanguage.en) {
          return 'Sorry, the error was not reported.';
        }
        return 'Desculpe, o erro não foi relatado.';
    }
  }
}
