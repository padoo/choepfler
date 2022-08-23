import {
  filterBadiOverviewInformation,
  getAllBadis,
  filterBadiByKanton,
  update_list,
  filterBadiByName,
   filterBadiByTemp, filterBadiByOrt, filterBadiByGratis
} from "./search.util.js";

let data = await getAllBadis();
data = await filterBadiOverviewInformation(data);

let filterGratisBadi = false;
const allData = data;
updateList(data);

let waterTemp = 0;


const search = document.getElementById("searchInput");
const kanton = document.getElementById("inputKanton");
const tempRange = document.getElementById('tempRange');
const tempInput = document.getElementById('tempInput');
const checkbox = document.getElementById('checkboxGratis');
tempInput.value = 0;
tempRange.value = 0;

kanton.onchange = (async e => {
  if (e.target.value) {
    await filter();
  }
})

search.oninput = (async e => {
  await filter();
})

checkbox.onclick = (async e => {
  filterGratisBadi = !filterGratisBadi;
  await filter();
})

async function filter() {
  data = allData;

  if (kanton.value) {
    data = await filterBadiByKanton(kanton.value, data);
  }
  if (search.value) {
    data = await filterBadiByName(search.value, data).concat(filterBadiByOrt(search.value, data));
  }
  if (tempRange.value || tempInput.value) {
    data = await filterBadiByTemp(tempRange.value, data);
  }
  if (filterGratisBadi) {
    data = await filterBadiByGratis(filterGratisBadi, data);
  }
  await updateList(data);
}


tempInput.onkeyup = (async e => {
  if (tempInput.value > 50 && tempInput.value < 15) {
    tempInput.value = 15;
  }
  waterTemp = e.target.value;
  tempRange.value = waterTemp;
  await filter();
});

tempRange.oninput = (async e => {
  waterTemp = e.target.value;
  tempInput.value = waterTemp;
  await filter();
});

async function updateList(data) {
  update_list(data);
}






