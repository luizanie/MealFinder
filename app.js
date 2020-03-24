const search = document.getElementById('search');
const submit = document.getElementById('submit');
const random = document.getElementById('random');
const mealsEl = document.getElementById('meals');
const resultHeading = document.getElementById('result-heading');
const single_mealEl = document.getElementById('single-meal');

function searchMeal(e) {
  e.preventDefault();


  single_mealEl.innerHTML = '';
  const term = search.value;

  if (term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then(res => res.json())
      .then(data => {

        resultHeading.innerHTML = `<h2> Search result for "${term}": </h2>`;

        if (data.meals === null) {
          resultHeading.innerHTML = 'No search result. Try again'
        } else {

          mealsEl.innerHTML = data.meals.map(meal => `
          <div class='meal'>

          <img src="${meal.strMealThumb}"/ alt=${meal.strMeal}/>

          <div class='meal-info' data-mealID="${meal.idMeal}"> 

          <h3> ${meal.strMeal}</h3>

          </div>
          </div>`
          ).join(' ');
        }
      })
    search.value = '';
  } else {
    alert('dodaj cos')
  }
}
function addMealToDom(meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(`
      ${meal[`strIngredient${i}`]} - 
      ${meal[`strMeasure${i}`]}`);
    }
    else {
      break;
    }
  }
  single_mealEl.innerHTML = `
  <div class='single-meal'> 
  <h2> ${meal.strMeal} </h2>
  <img src="${meal.strMealThumb}" />

  <div class='single-meal-info' >
${meal.strCategory ? `<p>${meal.strCategory}  </p> ` : ''}
  </div>

  <div class='main' >
  <h2> Ingredients</h2>
  <ul> 
  ${ingredients.map(ingredient =>
    `<li>${ingredient} </li> `
  ).join('')}
  </ul>
  <p> ${meal.strInstructions} </p>
  </div>
  `
}


function getMealById(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then(res => res.json())
    .then(data => {
      console.log(data);

      const meal = data.meals[0]
      addMealToDom(meal);
    })
};

function searchRandom() {
  mealsEl.innerHTML = '';
  resultHeading.innerHTML = '';

  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then(res => res.json())
    .then(data => {
      const meal = data.meals[0];
      getMealById(meal.idMeal);
    });
}

submit.addEventListener('submit', searchMeal);

random.addEventListener('click', searchRandom);


mealsEl.addEventListener('click', (e) => {

  const mealInfo = e.path.find(item => {
    if (item.classList) {
      return item.classList.contains('meal-info');
    }
    else {
      return false
    }
  });
  if (mealInfo) {
    const mealID = mealInfo.getAttribute('data-mealID');
    getMealById(mealID);
  }

});

