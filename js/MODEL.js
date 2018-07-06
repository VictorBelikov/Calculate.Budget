// MODULE (DATA).
// 1) Add the new item to our data structure. 2) Calculate budget.
const BudgetController = (function() {
  const Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function(totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    }
  };

  Expense.prototype.getPercentage = function() {
    return this.percentage;
  };

  const Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  const calculateTotal = function(type) {
    let sum = 0;
    data.allItems[type].forEach(el => {
      sum += el.value;
    });
    data.totals[type] = sum;
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
    },
    budget: 0,
    percentage: -1
  };

  return {
    addItem(type, descr, val) {
      let newItem, id;

      if (data.allItems[type].length !== 0) {
        id = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        id = 0;
      }

      if (type === 'exp') {
        newItem = new Expense(id, descr, val);
      } else if (type === 'inc') {
        newItem = new Income(id, descr, val);
      }

      data.allItems[type].push(newItem);
      return newItem;
    },

    deleteItem(type, id) {
      const ids = data.allItems[type].map(el => el.id);

      const index = ids.indexOf(id);
      if (~index) {
        data.allItems[type].splice(index, 1);
      }
    },

    calculateBudget() {
      // Calculate total income and expenses
      calculateTotal('exp');
      calculateTotal('inc');

      // Calculate the budget: income - expenses
      data.budget = data.totals.inc - data.totals.exp;

      // Calculate the percentage of income that we spent
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      }
    },

    calculatePercentages() {
      data.allItems.exp.forEach(el => {
        el.calcPercentage(data.totals.inc);
      });
    },

    getPercentages() {
      const allPerc = data.allItems.exp.map(el => el.getPercentage());
      return allPerc; // получили и вернули массив из скидок
    },

    getBudget() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
    }
  };
})();
