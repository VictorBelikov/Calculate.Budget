// VIEW.
// 1) Get input values. 2) Add the new item to the UI. 3) Update UI.
const UIController = (function() {
  const DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputButton: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensesPercLabel: '.item__percentage',
    dateLabel: '.budget__title--month'
  };

  function formatNumber(num, type) {
    num = Math.abs(num); // по модулю
    num = num.toFixed(2); // add decimal point

    // add comma separating the thousands
    const numSplit = num.split('.');
    let int = numSplit[0];
    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
    }
    const dec = numSplit[1];

    // + or - before number
    return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
  }

  function nodeListForEach(list, callback) {
    for (let i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  }

  return {
    getInput() {
      return {
        type: document.querySelector(DOMstrings.inputType).value, // 'inc' or 'exp'
        description: document.querySelector(DOMstrings.inputDescription).value, // it's <input/>
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value) // <input type="number"/>
      };
    },

    getDOMstring() {
      return DOMstrings;
    },

    addListItem(obj, type) {
      let html, newHtml, elem;

      // Create HTML string with placeholder text
      if (type === 'inc') {
        elem = DOMstrings.incomeContainer;
        html =
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === 'exp') {
        elem = DOMstrings.expensesContainer;
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // Replace the placeholder text with some actual data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

      // Insert the HTML into the DOM
      document.querySelector(elem).insertAdjacentHTML('beforeend', newHtml);
    },

    deleteListItem(selectorId) {
      const elem = document.getElementById(selectorId);
      elem.parentNode.removeChild(elem);
    },

    clearFields() {
      const fields = document.querySelectorAll(
        DOMstrings.inputDescription + ', ' + DOMstrings.inputValue
      );

      const fieldsArr = [].slice.call(fields); // превратили коллекцию узлов в массив

      fieldsArr.forEach(el => {
        el.value = ''; // очистили поля
      });
      fieldsArr[0].focus(); // возвращаем фокус полю с описанием
    },

    displayPercentages(percentages) {
      const fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

      nodeListForEach(fields, (el, index) => {
        if (percentages[index] > 0) {
          el.textContent = percentages[index] + '%';
        } else {
          el.textContent = '---';
        }
      });
    },

    displayBudget(obj) {
      let type;
      obj.budget > 0 ? (type = 'inc') : (type = 'exp');

      document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
      document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
      document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');

      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = '---';
      }
    },

    displayDate() {
      const currDate = new Date(),
        month = currDate.getMonth(),
        year = currDate.getFullYear(),
        months = [
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

      document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
    },

    changedType() {
      const fields = document.querySelectorAll(
        DOMstrings.inputType + ',' + DOMstrings.inputDescription + ',' + DOMstrings.inputValue
      );
      nodeListForEach(fields, el => el.classList.toggle('red-focus'));
      document.querySelector(DOMstrings.inputButton).classList.toggle('red');
    }
  };
})();
