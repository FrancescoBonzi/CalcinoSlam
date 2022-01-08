export default function getPlayerImages(id) {
  switch (id) {
    case 1:
      return require('./assets/players/1.jpg');
    case 2:
      return require('./assets/players/2.png');
    case 3:
      return require('./assets/players/3.png');
    case 4:
      return require('./assets/players/4.png');
    case 5:
      return require('./assets/players/5.png');
    case 6:
      return require('./assets/players/6.png');
    case 7:
      return require('./assets/players/7.png');
    case 8:
      return require('./assets/players/8.png');
    case 9:
      return require('./assets/players/9.png');
    case 10:
      return require('./assets/players/10.jpeg');
    case 11:
      return require('./assets/players/11.png');
    case 12:
      return require('./assets/players/12.png');
    case 13:
      return require('./assets/players/13.png');
    default:
      return require('./assets/players/profile.png');
  }
}
