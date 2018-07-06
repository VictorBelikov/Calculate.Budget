// CONTROLLER.
// 1) Add event handler. 2) Join Module and View.
const Controller = (function(budgetCtrl, UICtrl) {
  const updateBudget = function() {
    // 1. Calculate the budget
    budgetCtrl.calculateBudget();
    // 2. Return the budget
    const budget = budgetCtrl.getBudget();
    // 3. Display the budget on the UI
    UICtrl.displayBudget(budget);
  };

  const updatePercentages = function() {
    // 1. Calculate percentages
    budgetCtrl.calculatePercentages();
    // 2. Read percentages from the budget controller
    const percentages = budgetCtrl.getPercentages();
    // 3. Update the UI with the new percentages
    UICtrl.displayPercentages(percentages);
  };

  const ctrlAddItem = function() {
    // 1. Get the field input data
    const input = UICtrl.getInput(); // Получаем объект со всеми значениями полей ввода.

    if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
      // 2. Add the item to the MODEL(DATA)
      const newItem = budgetCtrl.addItem(input.type, input.description, input.value);
      // 3. Add the item to the UI
      UICtrl.addListItem(newItem, input.type);
      // 4. Clear the fields
      UICtrl.clearFields();
      // 5. Calculate and update budget
      updateBudget();
      // 6. Calculate and update percentages
      updatePercentages();
    }
  };

  const ctrlDeleteItem = function(event) {
    const itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemId) {
      const splitId = itemId.split('-');
      const type = splitId[0];
      const ID = +splitId[1];

      // 1. Delete the item from the data structure
      budgetCtrl.deleteItem(type, ID);
      // 2. Delete the item from the UI
      UICtrl.deleteListItem(itemId);
      // 3. Update and show the new budget
      updateBudget();
      // 4. Calculate and update percentages
      updatePercentages();
    }
  };

  const setupEventListeners = function() {
    const DOMstrings = UICtrl.getDOMstring(); // Получили все строки с представления

    // Нажатие кнопки с птичкой.
    document.querySelector(DOMstrings.inputButton).addEventListener('click', ctrlAddItem);

    // Нажатие ENTER в любом месте документа.
    document.addEventListener('keypress', event => {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });

    document.querySelector(DOMstrings.container).addEventListener('click', ctrlDeleteItem);
    document.querySelector(DOMstrings.inputType).addEventListener('change', UICtrl.changedType);
  };

  return {
    init() {
      UICtrl.displayDate();
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: 0
      });
      setupEventListeners();
    }
  };
})(BudgetController, UIController);

Controller.init();
