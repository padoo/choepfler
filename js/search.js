import {
  filterBadiOverviewInformation,
  getAllBadis,
  filterBadiByKanton,
  update_list,
  filterBadiByName,
  filterBadiByTemp,
  filterBadiByOrt,
  filterBadiByGratis
} from "./search.util.js";

let data = await getAllBadis();
data = await filterBadiOverviewInformation(data);
$("#spinner").toggle()

let filterGratisBadi = false;
let reverseList = false;

const allData = data.sort((a, b) => a.ort.localeCompare(b.ort));
updateList(allData);

let waterTemp = 0;


const search = document.getElementById("searchInput");
const kanton = document.getElementById("inputKanton");
const tempRange = document.getElementById('tempRange');
const tempInput = document.getElementById('tempInput');
const checkbox = document.getElementById('checkboxGratis');
const reverseButton = document.getElementById('reverseButton');
const resetButton = document.getElementById('resetTemperature');
const resultLengthBadis = document.getElementById('resultLengthBadis');

tempInput.value = 0;
tempRange.value = 0;

resetButton.hidden = true;

gefundeneBadis(data)

kanton.onchange = (async e => {
  await filter();
})

resetButton.onclick = (async e => {
  resetButton.hidden = true;
  tempInput.value = 0;
  tempRange.value = 0;
  await filter();
})

reverseButton.onclick = (async e => {
  reverseList = !reverseList;
  await filter();
})

search.oninput = (async e => {
  await filter();
})

checkbox.onclick = (async e => {
  filterGratisBadi = !filterGratisBadi;
  await filter();
})

function gefundeneBadis(data) {
  resultLengthBadis.innerHTML = "Gefunden: " + (data.length).toString();
}

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
  if (reverseList) {
    data = await reverseBadiList(data);
  }

  gefundeneBadis(data);

  await updateList(data);
}

tempInput.oninput = (async e => {
  resetButton.hidden = false;
  if (tempInput.value > 50 && tempInput.value < 15) {
    tempInput.value = 15;
  }
  if (!tempInput.value){
    tempInput.value = 0;
  }
  waterTemp = e.target.value;
  tempRange.value = waterTemp;
  await filter();
});

tempRange.oninput = (async e => {
  resetButton.hidden = false;
  waterTemp = e.target.value;
  tempInput.value = waterTemp;
  await filter();
});

async function updateList(data) {
  update_list(data);
}






