/*
VelJs is Velocity JavaScript by CharlesLana
A library that automates some features and returns feedback to the user
*/
class Vel {
  object = '';
  listObject = [];
  callback;
  #mask = /[^A-zÀ-ú0-9_\s]/gi;

  static typeCallback = {
    text: 'text',
    image: 'image',
    color: 'color',
    display: 'display',
    backgroundColor: 'backgroundColor',
  };

  getId(object) {
    this.#checkObjectNotNull(object);
    const element = document.querySelectorAll(`[id="${object}"]`);
    this.#checkMultipleId(element);
    return this.#getCallback(element[0]);
  }

  setId(object) {
    object = object.trim();
    this.#checkObjectNotNull(object);
    const element = document.querySelectorAll(`[id="${object}"]`);
    this.#checkMultipleId(element);
    this.#checkTextNotFound();
    this.#setCallback(element[0], this.object);
  }

  getOnlyClass(object) {
    this.#checkObjectNotNull(object);
    const element = document.querySelectorAll(
      `.${object.replace(this.#mask, '')}`
    );
    this.#checkMultipleClass(element);
    return this.#getCallback(element[0]);
  }

  setOnlyClass(object) {
    object = object.trim();
    this.#checkObjectNotNull(object);
    const element = document.querySelectorAll(
      `.${object.replace(this.#mask, '')}`
    );
    this.#checkMultipleClass(element);
    this.#checkTextNotFound();
    this.#setCallback(element[0], this.object);
  }

  getMultipleClass(object) {
    this.#checkObjectNotNull(object);
    const element = document.querySelectorAll(
      `.${object.replace(this.#mask, '')}`
    );
    this.#checkClassNotFound(element);
    const listObject = [];
    element.forEach((value) => {
      listObject.push(this.#getCallback(value));
    });
    return listObject;
  }

  setMultipleClass(object) {
    object = object.trim();
    this.#checkObjectNotNull(object);
    const element = document.querySelectorAll(
      `.${object.replace(this.#mask, '')}`
    );
    this.#checkClassNotFound(element);
    this.#checkTextNotFound();
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
        `.${value.replace(this.#mask, '')}`
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
    listObject.forEach((value, indexListObject) => {
      let object = value.trim();
      this.#checkObjectNotNull(object);
      let element = document.querySelectorAll(
        `.${object.replace(this.#mask, '')}`
      );
      this.#checkMultipleClass(element);
      this.#checkObjectListNotFound(listObject);
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
      case Vel.typeCallback.color:
        element.style.color = value;
        break;
      case Vel.typeCallback.display:
        element.style.display = value;
        break;
      case Vel.typeCallback.backgroundColor:
        element.style.backgroundColor = value;
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
      if (this.isEmpty(value.trim())) {
        const objectNotFound = this.#exceptionErrorMessage('objectNotFound');
        this.#messageError(objectNotFound);
      }
    });
    listObject.forEach((value) => {
      if (this.isEmpty(value)) {
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

  #checkTextNotFound() {
    if (this.isEmpty(this.object.trim())) {
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
    alert(`Error\nMessage: ${message}`);
    this.#exception(message);
  }

  #exception(message) {
    throw new Error(message);
  }

  #exceptionErrorMessage(message) {
    switch (message) {
      case 'notNull':
        return 'The field cannot be null, it must inform a parameter.';
      case 'objectNotArray':
        return 'Enter only a list of objects.';
      case 'idNotFound':
        return "Id not found\nMake sure your key doesn't start with numbers.";
      case 'multipleIds':
        return 'There are one or more IDs with the same key, check the document.';
      case 'objectNotFound':
        return 'You must set a object with the object property.';
      case 'classNotFound':
        return 'Class not found.';
      case 'multipleClasses':
        return 'There are one or more Classes with the same key, check the document.';
      case 'objectEqualNotFound':
        return 'The list of objects must be the same as the parameter entered.';
      case 'callbackNotFound':
        return 'Callback type not found or not entered.';
      case 'hasAttributeSrc':
        return 'There is no src attribute on the element.';
      case 'resultUndefined':
        return 'Callback result is undefined.';
      default:
        return 'Sorry, the error was not reported.';
    }
  }
}
