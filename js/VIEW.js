const UIController = (function() {
  const DOMstrs = {
    inputType: '.add__type',
    inputDescr: '.add__description',
    inputValue: '.add__value',
    inputButton: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    expensesLabel: '.budget__expenses--value',
    incomeLabel: '.budget__income--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensesPercLabel: '.item__percentage',
    dateLabel: '.budget__title--month'
  };

  // Форматирует числа к виду: +1,500.78
  function formatNumber(num, type) {
    num = Math.abs(num); // избавляемcя от знака
    num = num.toFixed(2); // округляем до 2 знаков; преобразуем число к строке
    const numSplit = num.split('.'); // '1500.78' --> ['1500', '78']
    let int = numSplit[0];
    const dec = numSplit[1];
    // Если целая часть >1000, то ставим запятую
    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); // '1500' --> '1,500'
    }
    return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
  }

  return {
    // Снимаем данные с полей input
    getInput() {
      return {
        type: document.querySelector(DOMstrs.inputType).value, // 'inc' or 'exp'
        description: document.querySelector(DOMstrs.inputDescr).value, // описание
        value: document.querySelector(DOMstrs.inputValue).value // число
      };
    },

    // Импортируем идентификаторы HTML эл-тов
    getDOMstrings() {
      return DOMstrs;
    },

    // Add item to the UI; obj is new Expense()/Income()
    addItem(obj, type) {
      let html, newHtml, elem;
      // 1. Create HTML string with placeholder text
      if (type === 'inc') {
        elem = DOMstrs.incomeContainer;
        html =
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === 'exp') {
        elem = DOMstrs.expensesContainer;
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      // 2. Replace placeholder text with some actual data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
      // 3. Insert HTML into the DOM
      document.querySelector(elem).insertAdjacentHTML('beforeend', newHtml);
    },

    // Очищаем поля input после click
    clearFields() {
      const fields = document.querySelectorAll(DOMstrs.inputDescr + ', ' + DOMstrs.inputValue);
      const arr = [].slice.call(fields); // Одалживание метода
      arr.forEach(el => {
        el.value = '';
      });
      arr[0].focus(); // После клика, фокус на поле ввода описания
    },

    // Отображаем общий бюджет
    displayBudget(obj) {
      document.querySelector(DOMstrs.budgetLabel).textContent = formatNumber(
        obj.budget,
        obj.budget > 0 ? 'inc' : 'exp'
      );
      document.querySelector(DOMstrs.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
      document.querySelector(DOMstrs.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
      if (obj.percentage > 0) {
        document.querySelector(DOMstrs.percentageLabel).textContent = obj.percentage + '%';
      } else {
        document.querySelector(DOMstrs.percentageLabel).textContent = '---';
      }
    },

    deleteItem(selectorId) {
      const el = document.getElementById(selectorId);
      el.parentNode.removeChild(el);
    },

    displayIndividPercentage(allPerc) {
      const percLabels = [].slice.call(document.querySelectorAll(DOMstrs.expensesPercLabel));
      percLabels.forEach((el, i) => {
        if (allPerc[i] > 0) {
          el.textContent = allPerc[i] + '%';
        } else {
          el.textContent = '---';
        }
      });
    },

    displayDate() {
      const now = new Date();
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
      document.querySelector(DOMstrs.dateLabel).textContent = `${months[now.getMonth()]} ${now.getFullYear()}`;
    },

    changedType() {
      // Меняем цвет полей
      const fields = document.querySelectorAll(
        DOMstrs.inputType + ',' + DOMstrs.inputDescr + ',' + DOMstrs.inputValue
      );
      fields.forEach(el => {
        el.classList.toggle('red-focus');
      });
      // Меняем цвет кнопки
      document.querySelector(DOMstrs.inputButton).classList.toggle('red');
    }
  };
})();
