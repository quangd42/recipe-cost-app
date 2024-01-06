// Helper functions

// SetRemoveEvents on remove buttons
const setRemoveEvents = () => {
  const removeButtons = document.querySelectorAll('.remove-button');
  removeButtons.forEach((button) => {
    button.addEventListener('click', async () => {
      await deleteIngredient(button);
    });
  });
};

document.addEventListener('DOMContentLoaded', setRemoveEvents());

// Update table content
const updateTable = (ingredients) => {
  console.log('ingredients', ingredients);
  const tbody = window.document.querySelector('#ingredient_list tbody');
  tbody.innerHTML = '';

  ingredients.forEach((ingredient) => {
    const row = document.createElement('tr');
    row.setAttribute(
      'class',
      'bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600',
    );
    // console.log('ingredient unit symbol', ingredient.unit['symbol'])

    const ingredientProps = new Map();
    ingredientProps.set('name', ingredient.name);
    ingredientProps.set('unit', ingredient.unit);
    ingredientProps.set('unitCost', ingredient.unitCost);

    // Ingredient info cell
    ingredientProps.forEach((value, key, map) => {
      const cell = document.createElement('td');
      cell.setAttribute(
        'class',
        'ingredient-name py-4 px-6 text-gray-900 dark:text-white',
      );

      const cellInner = document.createElement('div');
      cellInner.setAttribute('class', 'flex items-center space-x-3');
      if (key === 'unit') {
        cellInner.classList.add('capitalize');
        cellInner.innerHTML = value.name;
      } else {
        cellInner.innerHTML = value;
      }

      cell.appendChild(cellInner);
      row.appendChild(cell);
    });
    // Action Cell
    const actionCell = document.createElement('td');
    actionCell.setAttribute('class', 'py-4 px-6 flex justify-start gap-4');

    const editLink = document.createElement('a');
    editLink.setAttribute('href', `/ingredients/${ingredient._id}`);
    editLink.setAttribute(
      'class',
      'font-medium cursor-pointer text-blue-600 dark:text-blue-500',
    );
    editLink.innerHTML = 'Edit';
    actionCell.appendChild(editLink);

    const deleteButton = document.createElement('input');
    deleteButton.setAttribute('type', 'submit');
    deleteButton.setAttribute('value', 'Delete');
    deleteButton.setAttribute('data-id', `${ingredient._id}`);
    deleteButton.setAttribute(
      'class',
      'remove-button cursor-pointer font-medium text-red-600 dark:text-red-500',
    );
    actionCell.appendChild(deleteButton);

    row.appendChild(actionCell);

    tbody.appendChild(row);

    setRemoveEvents();
  });
};

const clearAddIngredientForm = (inputFields) => {
  inputFields.forEach((inputField) => {
    if (inputField.nodeName == 'SELECT') {
      inputField.value = 'default';
    } else {
      inputField.value = '';
    }
  });
};

// Send delete ingredient request
const deleteIngredient = async (button) => {
  if (confirm('Are you sure you want to delete this ingredient?')) {
    fetch(`/api/ingredients/${button.dataset.id}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (!res.ok) {
          alert('Something went wrong, please try again later.');
          console.log(res);
        } else {
          const row = button.closest('tr');
          row.remove();
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }
};

const getIngredients = async () => {
  try {
    const res = await fetch('/api/ingredients/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await res.json();
  } catch (err) {
    console.error(err);
  }
};

// Send AJAX request to add ingredient
const addIngredient = () => {
  const nameInput = document.querySelector('#ingredient_name');
  const unitInput = document.querySelector('#unit');
  const unitCostInput = document.querySelector('#unitCost');
  const ingredient = {
    name: nameInput.value,
    symbol: unitInput.value,
    unitCost: unitCostInput.value,
  };
  fetch('/api/ingredients', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(ingredient),
  })
    .then((response) => {
      // console.log(response);
      if (response.ok) {
        getIngredients()
          .then((ingredients) => {
            updateTable(ingredients);
            setRemoveEvents();
            clearAddIngredientForm([nameInput, unitInput, unitCostInput]);
          })
          .catch((error) => {
            console.error('Error:', error);
            alert('Something went wrong. Please try again later.');
          });
      } else {
        console.log('Error:', response);
        alert('Something went wrong. Please try again later.');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
};

// Button to trigger the AJAX request
const submitButton = document.querySelector(
  '#add_ingredient button[type="submit"]',
);
submitButton.addEventListener('click', (event) => {
  event.preventDefault();
  addIngredient();
});
