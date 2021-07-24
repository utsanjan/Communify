import { Injectable } from "@angular/core";
import * as firebase from "firebase";
import { Upload } from "../../shared/models/file";
import { AngularFireStorage } from "@angular/fire/storage";
import { UploadTask } from "@angular/fire/storage/interfaces";
@Injectable({
  providedIn: "root"
})
export class UploadService {
  basePath: string = "/uploads";
  uploadTask: UploadTask;
  constructor(private afs: AngularFireStorage) {}

  // Publish file in Firebase Storage
  publishUpload(upload: Upload) {
    this.uploadTask = this.afs.storage
      .ref()
      .child(`${this.basePath}/${upload.file.name}`)
      .put(upload.file);

    this.uploadTask.on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      snapshot => {
        upload.progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      error => console.log(error),
      () => {
        upload.url = this.uploadTask.snapshot.downloadURL;
        upload.name = upload.file.name;
      }
    );
  }
}
