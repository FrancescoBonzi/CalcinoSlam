export default function getLocationImages(id) {
  switch (id) {
    case 1:
      return require('./assets/locations/1.png');
    case 2:
      return require('./assets/locations/2.png');
    case 3:
      return require('./assets/locations/3.png');
    case 4:
      return require('./assets/locations/4.png');
    case 5:
      return require('./assets/locations/5.png');
    case 6:
      return require('./assets/locations/6.png');
    case 7:
      return require('./assets/locations/7.png');
    default:
      return require('./assets/locations/7.png');
  }
}
