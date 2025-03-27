let tags = [];

function displayRecipes(data) {
    console.log(data);
    document.querySelector("#recipes-list").innerHTML = ``
    data.forEach((recipe) => {

        document.getElementById("recipes-list").innerHTML += `
        <div class="col" class="recipe-card">
            <div class="card h-100">
              <div class="card-img-top"></div>
              <div class="card-body">
                <div class="row mb-2">
                  <h2 class="card-title col-8 card-name">${recipe.name}</h2>
                  <div class="card-title col-4 text-end card-time-container">
                    <img class="me-1 card-time-watch" alt="" src="./assets/img/watch-time.svg" /><span class="card-time">${recipe.time} min</span>
                  </div>
                </div>
                <div class="row">
                <ul class="card-text col-6 list-unstyled card-ingredients-list">
                    ${recipe.ingredients.map(ingredient => `
                      <li class="card-ingredients-list-item">
                        <span class="card-ingredients-list-item-ingredient">${ingredient.ingredient}</span>
                        <span class="card-ingredients-list-item-quantity">${ingredient.quantity || ''}</span>
                        <span class="card-ingredients-list-item-unit">${ingredient.unit || ''}</span>
                      </li>
                    `).join('')}
            
                  </ul>
                  <p class="card-text col-6 card-description">
                    ${recipe.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        `
    })
}

function searchRecipes(query) {
    fetch('./assets/json/recipes.json', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            const recipes = data.filter(recipe => recipe.name.toLowerCase().includes(query.toLowerCase()));
            if (recipes.length > 0) {
                searchRecipesByTag();
            } else {
                document.getElementById('recipes-list').innerHTML = '<div class="col"><h2>Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson », etc.</h2></div>';
            }
        })
}

let searchInput = ''

document.querySelector(".search-input").addEventListener('input', function () {
    const query = this.value.trim();
    if (query.length > 2) {
        searchInput = query;
        searchRecipesByTag();
    } else {
        document.getElementById('recipes-list').innerHTML = '';
    }
})

function searchRecipesByTag() {
    if (tags.length <= 0 && searchInput.length <= 0) {
        getAll();
        return;
    }
    fetch('./assets/json/recipes.json', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            // const recipes = data.filter(recipe => tags.every(tag => recipe.ingredients.some(ingredient => ingredient.ingredient.toUpperCase() === tag.toUpperCase())));
            const recipes = data.filter(recipe =>
                tags.every(tag => recipe.ingredients.some(ingredient => ingredient.ingredient.toUpperCase() === tag.toUpperCase())) &&
                recipe.name.toUpperCase().includes(searchInput.toUpperCase())
            );



            if (recipes.length > 0) {
                displayRecipes(recipes);
            } else {
                document.getElementById('recipes-list').innerHTML = '<div class="col"><h2>Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson », etc.</h2></div>';
        }})
}

document.querySelectorAll('.btn-tag-ingredient, .btn-tag-appliance, .btn-tag-ustensil').forEach(button => {
    button.addEventListener('click', function () {
        const tag = this.innerText;
        if (!tags.includes(tag)) {
            tags.push(tag);
            const tagElement = document.createElement('div');
            tagElement.className = 'tags badge tag-lait-de-coco bg-primary ps-3 pe-2 py-2 me-3 mb-2 rounded';
            tagElement.innerHTML = `
                <span>${tag}</span>
                <button type="button" class="tag-close-btn align-middle ms-1" aria-label="Close">
                    <img src="./assets/img/tag-close.svg" alt="" aria-hidden="true" />
                </button>
            `;
            document.querySelector("#tags-container").appendChild(tagElement);

            tagElement.querySelector('.tag-close-btn').addEventListener('click', function () {
                tagElement.remove();
                tags = tags.filter(t => t !== tag);
                searchRecipesByTag();
            });

            searchRecipesByTag();
        }
    });
});


function getAll() {
    fetch('./assets/json/recipes.json', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            displayRecipes(data)

            data.forEach((recipe) => {
                recipe.ingredients.forEach(ingredient => {
                    if (!ingredients.includes(ingredient.ingredient)) {
                        ingredients.push(ingredient.ingredient)
                    }
                })
            })
            updateIngredientsTags();
        })
}

getAll();

let ingredients = [];

function updateIngredientsTags() {
    const ingredients_list_tag = document.getElementById('ingredients-list');
    ingredients_list_tag.innerHTML = '';

    ingredients.forEach(ingredient => {
        ingredients_list_tag.innerHTML += `
            <li class="&quot;tags-ingredients&quot;">
            <button type="button" class="btn btn-tag-ingredient">${ingredient}</button>
            </li>
        `
    })
}