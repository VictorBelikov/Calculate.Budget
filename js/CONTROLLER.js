// CONTROLLER.
// 1) Add event handler. 2) Join Model and View.
const Controller = (function(budgetDataCtrl, UICtrl) {
  function updatePercentageEachItem() {
    // 1. Calculate percentages
    budgetDataCtrl.calcPercentageEachItem();
    // 2. Read percentages from the budgetDataController
    const percentages = budgetDataCtrl.getPercentageEachItem();
    // 3. Update the UI
    UICtrl.displayPercentageEachItem(percentages);
  }

  function updateBudget() {
    // 1. Calculate the budget
    budgetDataCtrl.calculateBudget();
    // 2. Return the budget
    const budget = budgetDataCtrl.getBudget();
    // 3. Display the budget on the UI
    UICtrl.displayBudget(budget);
  }

  function addItem() {
    // 1. Get the fields input data
    const fieldsValue = UICtrl.getInputValues();

    const tempStr = fieldsValue.description.trim(); // исключаем строку с пробелами
    if (
      fieldsValue.description &&
      tempStr &&
      !isNaN(fieldsValue.moneyValue) &&
      fieldsValue.moneyValue > 0
    ) {
      // 2. Add the item to the budgetDataController
      const newItem = budgetDataCtrl.addItem(
        fieldsValue.type,
        fieldsValue.description,
        fieldsValue.moneyValue
      );
      // 3. Add the item to the UI
      UICtrl.addItem(newItem, fieldsValue.type);
      // 4. Clear the fields
      UICtrl.clearFields();
      // 5. Calculate and update budget
      updateBudget();
      // 6. Update percentage for each item
      updatePercentageEachItem();
    }
  }

  function deleteItem(event) {
    const itemId = event.target.parentNode.parentNode.parentNode.parentNode.id; // 'inc-0'
    if (itemId) {
      const strId = itemId.split("-");
      const type = strId[0];
      const id = +strId[1];
      // 1. Delete item from the budgetDataController
      budgetDataCtrl.deleteItem(type, id);
      // 2. Delete item from the UI
      UICtrl.deleteItem(itemId);
      // 3. Update and show the new budget
      updateBudget();
      // 4. Update percentage for each item
      updatePercentageEachItem();
    }
  }

  function setupEventListeners() {
    const DOMStrings = UICtrl.getDOMstrings();

    document
      .querySelector(DOMStrings.addButton)
      .addEventListener("click", addItem);
    document.addEventListener("keypress", event => {
      if (event.keyCode === 13 || event.which === 13) {
        addItem();
      }
    });
    // Перехватываем события с кнопок удаления
    document
      .querySelector(DOMStrings.container)
      .addEventListener("click", deleteItem);
    // Чтобы поля расхода выделялисть красным при выборе
    document
      .querySelector(DOMStrings.inputType)
      .addEventListener("change", UICtrl.changedFieldType);
  }

  return {
    init() {
      UICtrl.displayDate();
      UICtrl.displayBudget({
        pureIncome: 0,
        totalInc: 0,
        totalExp: 0,
        totalPercentage: 0
      });
      setupEventListeners();
    }
  };
})(BudgetDataCtrl, UIController);

Controller.init();
