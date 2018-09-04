const Controller = (function(DataCtrl, UICtrl) {
  function updateBudget() {
    // 1. Calculate the budget
    DataCtrl.calculateBudget();
    // 2. Return the budget
    const budget = DataCtrl.getBudget();
    // 3. Display the budget on the UI
    UICtrl.displayBudget(budget);
  }
  // Индивидуальный процент для каждого эл-та расхода
  function updatePercentages() {
    // 1. Calculate percentages
    DataCtrl.calculatePercentages();
    // 2. Read percentages from the DataController
    const allPercentages = DataCtrl.getPercentages();
    // 3. Update UI with the new percentages
    UICtrl.displayIndividPercentage(allPercentages);

    DataCtrl.testing(); // ONLY FOR TESTING
  }

  const ctrlAddItem = function() {
    // 1. Get the field input data from the UI
    const input = UICtrl.getInput();

    if (input.description !== '' && +input.value > 0) {
      // 2. Add new item to the Data
      const newItem = DataCtrl.addItem(input.type, input.description, +input.value);
      // 3. Add new item to the UI
      UICtrl.addItem(newItem, input.type);
      UICtrl.clearFields(); // clear input fields
      // 4. Calculate and Update budget
      updateBudget();
      // 5. Calculate and Update percentages
      updatePercentages();
    }
  };

  const ctrlDeleteItem = function(event) {
    const itemId = event.target.parentNode.parentNode.parentNode.parentNode.id; // inc-0
    if (itemId) {
      const type = itemId.split('-')[0]; // inc
      const id = +itemId.split('-')[1]; // 0
      // 1. Delete item from the data
      DataCtrl.deleteItem(id, type);
      // 2. Delete item form the UI
      UICtrl.deleteItem(itemId);
      // 3. Update and show the new budget
      updateBudget();
      // 4. Calculate and Update percentages
      updatePercentages();
    }
  };

  function setupEventListeners() {
    const DOM = UICtrl.getDOMstrings();
    // Ставим listener на кнопку
    document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);
    // Ставим listener на весь документ
    document.addEventListener('keypress', e => {
      if (e.keyCode === 13 || e.which === 13) ctrlAddItem();
    });
    // Ставим listener на кнопки удаления с использованием делегирования событий
    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    // Ставим listener на +/-, чтобы изменять цвет кнопки и окантовки полей
    document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
  }

  return {
    init() {
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: 0
      });
      UICtrl.displayDate();
      setupEventListeners();
    }
  };
})(DataController, UIController);

Controller.init();
