function addFavoriteBadi(badiInfo) {
  const favoriteBadis = JSON.parse(localStorage.getItem('favoriteBadis')) || [];
  if (!favoriteBadis.some(b => b.id === badiInfo.id)) {
    favoriteBadis.push(badiInfo);
    localStorage.setItem('favoriteBadis', JSON.stringify(favoriteBadis));
  }
}

function deleteFavoriteBadi(badiInfo) {
  let favoriteBadis = JSON.parse(localStorage.getItem('favoriteBadis')) || [];
  favoriteBadis = favoriteBadis.filter(b => b.id !== badiInfo.id);
  localStorage.setItem('favoriteBadis', JSON.stringify(favoriteBadis));
}

function getFavoriteBadis() {
  return JSON.parse(localStorage.getItem('favoriteBadis')) || [];
}

function isFavorite(badiInfo) {
  const favoriteBadis = getFavoriteBadis();
  return favoriteBadis.some(b => b.id === badiInfo.id)
}

function addToLocalStorage(storageName, key, value) {
  const storage = JSON.parse(localStorage.getItem(storageName)) || {};
  storage[key] = value;
  localStorage.setItem(storageName, JSON.stringify(storage));
}

function getFromLocalStorage(storageName, key) {
  return JSON.parse(localStorage.getItem(storageName))[key];
}

function resetLocalStorage(storageName) {
  localStorage.setItem(storageName, JSON.stringify({}));
}

function addFeatureToggle(key) {
  addToLocalStorage('featureToggles', key, true);
}

function getFeatureToggle(key) {
  return getFromLocalStorage('featureToggles', key);
}

function getFeatureToggles() {
  return JSON.parse(localStorage.getItem('featureToggles')) || {};
}

function resetFeatureToggles() {
  resetLocalStorage('featureToggles');
}


export {
  addFavoriteBadi,
  deleteFavoriteBadi,
  getFavoriteBadis,
  isFavorite,
  addFeatureToggle,
  getFeatureToggle,
  getFeatureToggles,
  resetFeatureToggles
};
