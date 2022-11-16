
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default (context, inject) => {
  const firebaseConfig = {
    apiKey: "AIzaSyBF_9xP-MxJ3XCHCIz9lqqJoxcz4TqD_A0",
    authDomain: "notificaciones-34e84.firebaseapp.com",
    projectId: "notificaciones-34e84",
    storageBucket: "notificaciones-34e84.appspot.com",
    messagingSenderId: "220734941199",
    appId: "1:220734941199:web:4e4b2b2af4cda6da429b7a",
    measurementId: "G-JV1VV3K3S9"
  };

  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);

  const uploadFile = {
    upload(file) {
      const storageRef = ref(storage, `/Imagenes/${file.name}`);
        uploadBytes(storageRef, file).then((snapshot) => {
          console.log('Se ha cargado el archivo!');
      });      
    },
    async getURL(file) {
      const storageRef = ref(storage, `/Imagenes/${file.name}`);
      const url = await getDownloadURL(storageRef);
      return url;
    }
  };

  inject('firebase', uploadFile)

}