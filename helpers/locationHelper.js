import tzlookup from "tz-lookup";

function haversineDistance(lat1, lon1, lat2, lon2) { //计算两个坐标之间的距离
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

function findClosestLocation(userLat, userLon, data) { //接受一个用户的经纬度，以及一个包含多个未知的数据数组，返回距离用户最近的位置
  if (!Array.isArray(data)) {
    throw new Error("Data must be an array of location objects");
  }
  let closestLocation = data[0];
  let closestDistance = haversineDistance(
    userLat,
    userLon,
    parseFloat(data[0].latitude),
    parseFloat(data[0].longitude)
  );

  data.forEach((location) => {
    const distance = haversineDistance(
      userLat,
      userLon,
      parseFloat(location.latitude),
      parseFloat(location.longitude)
    );
    if (distance < closestDistance) {
      closestDistance = distance;
      closestLocation = location;
    }
  });

  return closestLocation;
}

export function getTimezone(lat, lng) {  //根据经纬度找到相应的时区
  const timezone = tzlookup(lat, lng);
  return timezone;
}

export async function reverseGeocode(lat, lng) {  //接受经纬度作为参数，返回与这些坐标接近的地理位置，从postcodes的文件中导入地理位置数据，最后找到最接近的地理位置
  try {
    if (lat == null || lng == null) {
      console.log("Invalid geo location");
      return null;
    } //如果经度或者纬度有一个为null，则输出null

    let resGeo = await import("./../public/postcodes.json"); //读取这个文件的地理位置信息

    const closestLocation = findClosestLocation(lat, lng, resGeo.default);
    //找到最接近的地理位置

    const suburb = closestLocation.suburb; //从closestLocation里提取郊区，州，邮编
    const state = closestLocation.state;
    const postcode = closestLocation.postcode;

    return { suburb, state, postcode }; //将这些数据返回，从这里返回到homepage
  } catch (error) {
    console.error("Error reverse geocoding:", error);
    return null; //如果出现错误，在控制台输出错误信息，返回null
  }
}
