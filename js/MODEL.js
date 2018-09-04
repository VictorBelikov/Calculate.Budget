const DataController = (function() {
  function Expense(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  }
  Expense.prototype.calcIndividPercentage = function(totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    }
  };
  Expense.prototype.getPercentage = function() {
    return this.percentage;
  };

  function Income(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  }

  const data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0, // income - expenses
    percentage: -1 // общий % расходов
  };

  function calculateTotal(type) {
    let sum = 0;
    data.allItems[type].forEach(el => {
      sum += el.value;
    });
    data.totals[type] = sum;
  }

  return {
    addItem(type, descr, val) {
      let newItem, id;
      // Create new id
      if (data.allItems[type].length > 0) {
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

    calculateBudget() {
      // 1. Calculate total income and expenses
      calculateTotal('exp');
      calculateTotal('inc');
      // 2. Calculate: income - expenses
      data.budget = data.totals.inc - data.totals.exp;
      // 3. Calculate the percentage of income
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      }
    },

    getBudget() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
    },

    deleteItem(id, type) {
      // const ids = data.allItems[type].map(el => el.id); // получаем массив из айдишников
      // const index = ids.indexOf(id);
      const index = data.allItems[type].findIndex(el => el.id === id);
      if (~index) {
        data.allItems[type].splice(index, 1);
      }
    },

    // Индивидуальный процент для каждого эл-та расхода
    calculatePercentages() {
      data.allItems.exp.forEach(el => {
        el.calcIndividPercentage(data.totals.inc);
      });
    },

    getPercentages() {
      return data.allItems.exp.map(el => el.getPercentage());
    },

    testing() {
      console.log(data);
    }
  };
})();
