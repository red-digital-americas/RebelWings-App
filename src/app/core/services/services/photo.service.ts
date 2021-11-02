import { Injectable } from '@angular/core';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';

import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  public photos: UserPhoto[] = [];
  private photoStorage = 'photos';

  constructor(private platform: Platform) {}

  public async loadSaved() {
    // Recuperar datos de matrices de fotos en caché
    const photoList = await Storage.get({ key: this.photoStorage });
    this.photos = JSON.parse(photoList.value) || [];

    // Si se ejecuta en la web ...
    if (!this.platform.is('hybrid')) {
      // mostrar la foto leyendo en formato base64
      for (const photo of this.photos) {
        // Leer los datos de cada foto guardada del sistema de archivos
        const readFile = await Filesystem.readFile({
          path: photo.filepath,
          directory: Directory.Data,
        });

        // Solo plataforma web: cargue la foto como datos base64
        // photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
        photo.webviewPath = readFile.data;
      }
    }
  }

  public async addNewToGallery() {
    // Toma una foto
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri, // file-based data; provides best performance
      source: CameraSource.Camera, // tomar automáticamente una nueva foto con la cámara
      quality: 100, // highest quality (0 to 100)
    });

    const savedImageFile = await this.savePicture(capturedPhoto);

    // Add new photo to Photos array
    this.photos.unshift(savedImageFile);

    // Almacene en caché todos los datos de las fotos para recuperarlos en el futuro
    Storage.set({
      key: this.photoStorage,
      value: JSON.stringify(this.photos),
    });
  }

  // Save picture to file on device
  private async savePicture(cameraPhoto: Photo) {
    // Convierta la foto al formato base64, requerido por la API del sistema de archivos para guardar
    const base64Data = await this.readAsBase64(cameraPhoto);

    // Write the file to the data directory
    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data,
    });

    if (this.platform.is('hybrid')) {
      // Display the new image by rewriting the 'file://' path to HTTP
      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri),
      };
    } else {
      // Use webPath to display the new image instead of base64 since it's
      // already loaded into memory
      return {
        filepath: fileName,
        webviewPath: cameraPhoto.webPath,
      };
    }
  }

  //Lee la foto de la cámara en formato base64 según la plataforma en la que se ejecuta la aplicación
  private async readAsBase64(cameraPhoto: Photo) {
    // "hybrid" will detect Cordova or Capacitor
    if (this.platform.is('hybrid')) {
      // Read the file into base64 format
      const file = await Filesystem.readFile({
        path: cameraPhoto.path,
      });

      return file.data;
    } else {
     // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
     const response = await fetch(cameraPhoto.webPath!);
     const blob = await response.blob();

     return (await this.convertBlobToBase64(blob)) as string;
    }
  }

  // Elimine la imagen eliminándola de los datos de referencia y del sistema de archivos

  // eslint-disable-next-line @typescript-eslint/member-ordering
  public async deletePicture(photo: UserPhoto, position: number) {
    // Remove this photo from the Photos reference data array
    this.photos.splice(position, 1);

    // Update photos array cache by overwriting the existing photo array
    Storage.set({
      key: this.photoStorage,
      value: JSON.stringify(this.photos),
    });

    // eliminar archivo de foto del sistema de archivos
    const filename = photo.filepath.substr(photo.filepath.lastIndexOf('/') + 1);
    await Filesystem.deleteFile({
      path: filename,
      directory: Directory.Data,
    });
  }
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public async deleteAllPhoto(data){
    this.photos = [];
    Storage.set({
      key: this.photoStorage,
      value: JSON.stringify(this.photos),
    });
    // eliminar archivo de foto del sistema de archivos
    await data.photoValidationGas.forEach((element) => {

      const filename = element.filepath.substr(element.filepath.lastIndexOf('/') + 1);
       Filesystem.deleteFile({
        path: filename,
        directory: Directory.Data,
      });
    });
  }

  private convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
}

export interface UserPhoto {
  filepath: string;
  webviewPath: string;
}
