const images = require.context('../assets/images/', true, /\.(png|jpg|jpeg|gif|svg)$/);
images.keys().forEach(images);