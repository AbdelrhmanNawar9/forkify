import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './view/recipeView.js';
import searchView from './view/searchView.js';
import resultsView from './view/resultsView.js';
import paginationView from './view/paginationView.js';
import bookmarksView from './view/bookmarksView.js';
import addRecipeView from './view/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

if (module.hot) {
  module.hot.accept();
}
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    // 0) Update results view to mark selected result
    // resultsView.update(model.getSearchResultsPage());

    // 1) Update bookmarks view
    bookmarksView.update(model.state.bookmarks);

    //2) load recipe
    await model.loadRecipe(id);

    //3) Render recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1) get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2)load search results
    await model.loadSearchResults(query);

    //3) render results
    resultsView.render(model.getSearchResultsPage());

    //4)Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  //1) Render New results
  resultsView.render(model.getSearchResultsPage(goToPage));

  //2)Render New pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //1) add or remove recipe to bookmarks
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  // delete recipe from  bookmarkes
  else model.deleteBookmark(model.state.recipe.id);
  // 2) update the recipe Virw
  recipeView.update(model.state.recipe);

  //3) Render Bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //Show loading spinner
    addRecipeView.renderSpinner();

    //Upload the new Recipe data
    await model.uploadRecipe(newRecipe);

    //Render Recipe
    recipeView.render(model.state.recipe);

    //Success message
    addRecipeView.renderMessage();

    //Render bookmarks View
    bookmarksView.addHandlerRender(model.state.bookmarks);

    //Change id in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //Close Form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);

  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  console.log('Welcome');
  console.log('aaa');
};

init();
