require('dotenv').config();

function getDaysDifference(date1, date2) {
  const oneDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day

  // Convert the input dates to UTC to ensure consistent calculations
  const utcDate1 = new Date(date1.toUTCString());
  const utcDate2 = new Date(date2.toUTCString());

  // Calculate the difference in days
  const diffInDays = Math.round(Math.abs((utcDate1 - utcDate2) / oneDay));

  return diffInDays;
}

function getChanges(plant_details, current_weather) {
  let optimal_weather = Number(plant_details["optimal_weather"]);
  let humidity = Number(plant_details["humidity"]);
  plant_details["humidity"] = (humidity * (1 + (current_weather - optimal_weather) / 20)).toFixed(1) + "L";
  return plant_details;
}

async function calculate(start_date, plants, families, current_weather) {
  let res = []
  plants.forEach(async plant => {
    try{
      const diff_days = getDaysDifference(start_date, new Date());
      let family_details = families.filter(obj => obj._id.equals(plant.family))[0];
      var plant_details = JSON.parse(JSON.stringify(family_details));
      plant_details._id = plant._id;
      plant_details.name = plant.name;
      let plantFreq = parseInt(plant_details["frequency_of_irrigation"])
      if(diff_days % plantFreq == 0) {
        plant_details = getChanges(plant_details, current_weather);
        res.push(plant_details)
      }
    }catch(err){
      console.log(err);
    }
  });
  return res;
}

module.exports = { calculate };