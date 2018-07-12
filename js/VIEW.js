// VIEW.
// 1) Get input values. 2) Add the new item to the UI. 3) Update UI.
const UIController = (function() {
  const DOMStrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputMoneyValue: '.add__value',
    addButton: '.add__btn',
    incomesList: '.income__list',
    expensesList: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expenseLabel: '.budget__expenses--value',
    totalPercentageLabel: '.budget__expenses--percentage',
    eachPercentageLable: '.item__percentage',
    container: '.container',
    dateLabel: '.budget__title--month'
  };

  function formatNumber(num, type) {
    num = Math.abs(num); // убираем знак
    num = num.toFixed(2);

    const numSplit = num.split('.');
    const dec = numSplit[1];
    let int = numSplit[0];
    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
    }
    return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
  }

  function nodeListForEach(list, callBack) {
    for (let i = 0; i < list.length; i++) {
      callBack(list[i], i);
    }
  }

  return {
    getInputValues() {
      return {
        type: document.querySelector(DOMStrings.inputType).value, // may be 'inc' or 'exp'
        description: document.querySelector(DOMStrings.inputDescription).value,
        moneyValue: parseFloat(document.querySelector(DOMStrings.inputMoneyValue).value)
      };
    },

    getDOMstrings() {
      return DOMStrings;
    },

    addItem(obj, type) {
      let html, newHtml, container;
      // 1. Create HTML string
      if (type === 'inc') {
        container = DOMStrings.incomesList;
        html =
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === 'exp') {
        container = DOMStrings.expensesList;
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      // 2. Replace the placeholder in HTML string
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%value%', formatNumber(obj.moneyValue, type));
      newHtml = newHtml.replace('%description%', obj.description);
      // 3. Insert HTML string into the DOM
      document.querySelector(container).insertAdjacentHTML('beforeend', newHtml);
    },

    deleteItem(id) {
      const el = document.getElementById(id);
      el.parentNode.removeChild(el); // сама себя удаляет
    },

    clearFields() {
      const fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputMoneyValue);
      [].forEach.call(fields, el => {
        el.value = '';
      });
      fields[0].focus(); // возращаем фокус первому полю
    },

    displayBudget(obj) {
      let type;
      obj.pureIncome > 0 ? (type = 'inc') : (type = 'exp');

      document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.pureIncome, type);
      document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
      document.querySelector(DOMStrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');
      if (obj.totalPercentage > 0) {
        document.querySelector(DOMStrings.totalPercentageLabel).textContent = obj.totalPercentage + '%';
      } else {
        document.querySelector(DOMStrings.totalPercentageLabel).textContent = '---';
      }
    },

    displayPercentageEachItem(percentages) {
      const fields = document.querySelectorAll(DOMStrings.eachPercentageLable);

      nodeListForEach(fields, (el, index) => {
        if (percentages[index] > 0) {
          el.textContent = percentages[index] + '%';
        } else {
          el.textContent = '---';
        }
      });
    },
    // Вызывается в init()
    displayDate() {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ];
      document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ' ' + year;
    },
    // Чтобы поля расхода выделялисть красным при выборе
    changedFieldType() {
      const fields = document.querySelectorAll(
        DOMStrings.inputType + ',' + DOMStrings.inputDescription + ',' + DOMStrings.inputMoneyValue
      );
      nodeListForEach(fields, el => el.classList.toggle('red-focus'));
      document.querySelector(DOMStrings.addButton).classList.toggle('red');
    }
  };
})();
