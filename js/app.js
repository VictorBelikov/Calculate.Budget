// MODULE (DATA).
// 1) Add the new item to our data structure. 2) Calculate budget.
const BudgetController = (function() {
  const Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  const Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  // Тут храняться данные пока скрипт не будет перезапущен
  const data = {
    allItems: {
      exp: [], // все объекты расходов
      inc: [] // все объекты доходов
    },
    totals: {
      exp: 0, // общая сумма расходов
      inc: 0 // общая сумма доходов
    }
  };

  return {
    addItem(type, descr, val) {
      let newItem, id;

      if (data.allItems[type].length !== 0) {
        id = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        id = 0;
      }

      if (type === "exp") {
        newItem = new Expense(id, descr, val);
      } else if (type === "inc") {
        newItem = new Income(id, descr, val);
      }

      data.allItems[type].push(newItem);
      data.totals[type] += +newItem.value;
      return newItem;
    },

    testing() {
      console.log(data);
    }
  };
})();

// ======================================================================================
// VIEW.
// 1) Get input values. 2) Add the new item to the UI. 3) Update UI.
const UIContoller = (function() {
  const DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputButton: ".add__btn",
    incomeContainer: ".income__list",
    expensesContainer: ".expenses__list"
  };

  return {
    getInput() {
      return {
        type: document.querySelector(DOMstrings.inputType).value, // 'inc' or 'exp'
        description: document.querySelector(DOMstrings.inputDescription).value, // it's <input/>
        value: document.querySelector(DOMstrings.inputValue).value // <input type="number"/>
      };
    },

    getDOMstring() {
      return DOMstrings;
    },

    addListItem(obj, type) {
      let html, newHtml, elem;

      // Create HTML string with placeholder text
      if (type === "inc") {
        elem = DOMstrings.incomeContainer;
        html =
          '<div class="item clearfix" id="income-%id%"><div ="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === "exp") {
        elem = DOMstrings.expensesContainer;
        html =
          '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i ="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // Replace the placeholder text with some actual data
      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", obj.value);

      // Insert the HTML into the DOM
      document.querySelector(elem).insertAdjacentHTML("beforeend", newHtml);
    },

    clearFields() {
      const fields = document.querySelectorAll(
        DOMstrings.inputDescription + ", " + DOMstrings.inputValue
      );

      const fieldsArr = [].slice.call(fields);

      fieldsArr.forEach(el => {
        el.value = "";
      });
      fieldsArr[0].focus(); // возвращаем фокус полю с описанием
    }
  };
})();

// ======================================================================================
// CONTROLLER.
// 1) Add event handler. 2) Join Module and View.
const Controller = (function(budgetCtrl, UICtrl) {
  const updateBudget = function() {
    // 1. Calculate the budget
    // 2. Return the budget
    // 3. Display the budget on the UI
  };

  const ctrlAddItem = function() {
    // 1. Get the field input data
    const input = UICtrl.getInput(); // Получаем объект со всеми значениями полей ввода.

    // 2. Add the item to the MODEL(DATA)
    const newItem = budgetCtrl.addItem(
      input.type,
      input.description,
      input.value
    );

    // 3. Add the item to the UI
    UICtrl.addListItem(newItem, input.type);

    // 4. Clear the fields
    UICtrl.clearFields();
  };

  const setupEventListeners = function() {
    const DOMstrings = UICtrl.getDOMstring(); // Получили все строки с представления

    // Нажатие кнопки с птичкой.
    document
      .querySelector(DOMstrings.inputButton)
      .addEventListener("click", ctrlAddItem);

    // Нажатие ENTER в любом месте документа.
    document.addEventListener("keypress", event => {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
  };

  return {
    init() {
      setupEventListeners();
    }
  };
})(BudgetController, UIContoller);

Controller.init();
