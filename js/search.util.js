async function getSearchResult(searchString) {
  try {
    const response = await fetch('https://www.wiewarm.ch:443/api/v1/bad.json?search=' + searchString);
    return await response.json();
  } catch (e) {
    return Promise.resolve([]);
  }
}

export async function getAllBecken() {
  try {
    const response = await fetch('https://www.wiewarm.ch:443/api/v1/temperature/all_current.json/0');
    return await response.json();
  } catch (e) {
    return Promise.resolve([]);
  }
}


async function badiOverviewInformationForKanton(kanton) {
  const becken = await getAllBecken();
  const beckenImKanton = becken.filter(b => b.kanton.toUpperCase() === kanton.toUpperCase());
  const einBeckenProBadi = [];

  beckenImKanton.forEach(b1 => {
    if (!einBeckenProBadi.find(b2 => b1.badid === b2.badid)) {
      einBeckenProBadi.push(b1);
    }
  });

  einBeckenProBadi.sort((a, b) => a.ort === b.ort ? 0 : a.ort < b.ort ? -1 : 1);

  return await Promise.all(einBeckenProBadi.map(async function (becken) {
    const badiInfo = {};
    badiInfo.name = becken['bad'];
    badiInfo.ort = becken['ort'];
    badiInfo.id = becken['badid'];
    badiInfo.bildUrl = await getBadiPicture(badiInfo.id);
    badiInfo.kanton = becken['kanton'];
    return badiInfo;
  }));
}

export function filterBadiByKanton(kanton, data) {
  return (data.filter(b => b.kanton === (kanton.slice(kanton.length - 3)).slice(0, -1)));
}

export function filterBadiByName(badiName, data) {
  return data.filter(b => b.name.toUpperCase().includes(badiName.toUpperCase()));
}

export function filterBadiByOrt(badiOrt, data) {
  return data.filter(b => b.ort.toUpperCase().includes(badiOrt.toUpperCase()));
}

export function filterBadiByTemp(badiTemp, data) {
  return data.filter(b => Math.round(parseFloat(b.temperatur)) >= parseFloat(badiTemp + ".0"));
}

export async function filterBadiByGratis(isBadiGratis, data) {
  // TODO badi gratis Id updaten (CTRL-160)
  let badiGratisId = [49, 126, 17, 44, 156, 190, 43, 187, 124, 210, 34, 40, 65, 67, 47, 68, 48, 61, 128, 11, 50, 125, 200, 51, 199, 206, 120, 178, 15, 227];
  return data.filter(b => badiGratisId.includes(b.id));
}

async function getAllBadis() {
  const becken = await getAllBecken();
  const einBeckenProBadi = [];

  becken.forEach(b1 => {
    if (!einBeckenProBadi.find(b2 => b1.badid === b2.badid)) {
      einBeckenProBadi.push(b1);
    }
  });

  einBeckenProBadi.sort((a, b) => a.ort === b.ort ? 0 : a.ort < b.ort ? -1 : 1);

  return await Promise.all(einBeckenProBadi.map(async function (becken) {
    const badiInfo = {};
    badiInfo.name = becken['bad'];
    badiInfo.ort = becken['ort'];
    badiInfo.id = becken['badid'];
    badiInfo.bildUrl = await getBadiPicture(badiInfo.id);
    badiInfo.kanton = becken['kanton'];
    badiInfo.temperatur = becken['temp'];
    return badiInfo;
  }));
}


async function badiOverviewInformation(data) {
  return await Promise.all(data.map(async function (badi) {
      const badiInfo = {};
      badiInfo.name = badi['bad'];
      badiInfo.ort = badi['ort'];
      badiInfo.id = badi['badid'];
      badiInfo.bildUrl = await getBadiPicture(badiInfo.id);
      badiInfo.kanton = badi['kanton'];
      return badiInfo;
    }
  ));
}

export async function filterBadiOverviewInformation(data) {
  return await Promise.all(data.map(async function (badi) {
      const badiInfo = {};
      badiInfo.name = badi['name'];
      badiInfo.ort = badi['ort'];
      badiInfo.id = badi['id'];
      badiInfo.bildUrl = await getBadiPicture(badiInfo.id);
      badiInfo.kanton = badi['kanton'];
      badiInfo.temperatur = badi['temperatur'];
      return badiInfo;
    }
  ));
}

async function getBadiPicture(badId) {
  const response = await fetch('https://www.wiewarm.ch:443/api/v1/image.json/' + badId);
  const data = await response.json();
  let bildUrl = "assets/platzhalter_3.png"
  if (data.length > 0) {
    let imageUrl = data[0].image;
    bildUrl = "https://www.wiewarm.ch/" + imageUrl;
  }
  return bildUrl;
}

function update_list(suchergebnisse, jqueryId = '#badiliste') {
  $(jqueryId).empty();
  if (suchergebnisse.length === 0) {
    $(jqueryId).append(`<p>Keine Badi gefunden.</p>`);
    return;
  }

  suchergebnisse.forEach(suchergebnis => {
    $(jqueryId).append(`
<a href="details?id=${suchergebnis.id}" class="hiddenlink">
  <div class="card mb-3">
    <div class="card-body">
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 py-2">
            <div class="d-flex schwimmbad-bild">
              <img src="${suchergebnis.bildUrl}" class="img-fluid schwimmbad-bild">
            </div>
          </div>
          <div class="align-middle col-sm-12 col-md-6 col-lg-6 py-2">
              <div class="schwimmbad-text">
                  <div class="text-center">
                      <h5>${suchergebnis.name}</h5>
                      <p>${suchergebnis.ort}</p>
                  </div>
              </div>
          </div>
        </div>
    </div>
  </div>
</a>
    `)
  });
}


export {
  getSearchResult,
  badiOverviewInformation,
  badiOverviewInformationForKanton,
  getBadiPicture,
  update_list,
  getAllBadis
};
