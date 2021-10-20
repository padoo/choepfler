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


export {addFavoriteBadi, deleteFavoriteBadi, getFavoriteBadis, isFavorite};
