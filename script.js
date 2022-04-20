const urlBase = 'https://api.ecowitt.net/api/v3/device/real_time?';
const appKey = 'application_key=C8F4FB6018C47C4331D9F1AEB765AB68';
const apiKey ='api_key=bb7008ec-9fb1-44ca-b8be-46387b40b46b'
const mac ='mac=C4:5B:BE:6E:51:D1';
const cb ='call_back=all'
const tmpUnit = 'temp_unitid=1';
const pUnit = 'pressure_unitid=5'
const wSpeed = 'wind_speed_unitid=7';

const finalUrl = `${urlBase}${appKey}&${apiKey}&${mac}&${cb}&${tmpUnit}&${pUnit}&${wSpeed}`;

fetch(finalUrl)
  .then((response) => {
    return response.json();
  })
  .then((datas) => {
    const divData = document.getElementById('data');    
    //divData.innerHTML = JSON.stringify(datas.data.outdoor);
    const data = datas.data.outdoor;
    const tbody = document.querySelector('#table-data tbody');
    tbody.innerHTML += `
      <tr>
        <th scope="row">1</th>
        <td>${data.temperature.value} ºC</td>
        <td>${data.feels_like.value} ºC</td>
        <td>${data.humidity.value} %</td>
      </tr>
    `;
  });