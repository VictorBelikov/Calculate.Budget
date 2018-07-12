// MODEL (DATA).
// 1) Add the new item to our data structure. 2) Calculate budget.
const BudgetDataCtrl = (function() {
  function Income(id, description, moneyValue) {
    this.id = id;
    this.description = description;
    this.moneyValue = moneyValue;
  }

  function Expense(id, description, moneyValue) {
    this.id = id;
    this.description = description;
    this.moneyValue = moneyValue;
    this.percentage = -1;
  }

  Expense.prototype.calcPercentage = function(totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.moneyValue / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function() {
    return this.percentage;
  };

  const data = {
    allItems: {
      inc: [],
      exp: []
    },
    totals: {
      inc: 0,
      exp: 0
    },
    pureIncome: 0,
    totalPercentage: -1
  };

  function calculateTotal(type) {
    let sum = 0;
    data.allItems[type].forEach(el => {
      sum += el.moneyValue;
    });
    data.totals[type] = sum;
  }

  return {
    addItem(type, descr, moneyVal) {
      let newItem,
        id = 0;

      if (data.allItems[type].length > 0) {
        const tempArr = data.allItems[type];
        id = tempArr[tempArr.length - 1].id + 1;
      }

      if (type === "inc") {
        newItem = new Income(id, descr, moneyVal);
      } else if (type === "exp") {
        newItem = new Expense(id, descr, moneyVal);
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
      // 1. Calculate total income and expenses
      calculateTotal("inc");
      calculateTotal("exp");
      // 2. Calculate percentage
      data.pureIncome = data.totals.inc - data.totals.exp;
      if (data.totals.inc > 0) {
        data.totalPercentage = Math.round(
          (data.totals.exp / data.totals.inc) * 100
        );
      }
    },

    getBudget() {
      return {
        pureIncome: data.pureIncome,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        totalPercentage: data.totalPercentage
      };
    },

    calcPercentageEachItem() {
      data.allItems.exp.forEach(el => {
        el.calcPercentage(data.totals.inc);
      });
    },

    getPercentageEachItem() {
      return data.allItems.exp.map(el => el.getPercentage());
    },

    testing() {
      console.log(data);
    }
  };
})();
