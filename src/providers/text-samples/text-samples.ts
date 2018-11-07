import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TextSamplesProvider {
  private textSamples: AngularFirestoreCollection<any>;
  private allText: Observable<any>;

  private appText: AngularFirestoreCollection<any>;
  //private appTextData: Observable<any>;

  constructor(private afs: AngularFirestore) {
    this.textSamples = this.afs.collection('textSpeechTest', ref => ref.orderBy('displayOrder'));
    //this.allTextData = this.textSamples.valueChanges();

    this.appText = this.afs.collection('textSpeechAppConfig');
    //this.appTextData = this.appText.valueChanges();

    this.allText = this.textSamples.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

    /* this.afs.collection("textSpeechTest").ref.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          //console.log(doc);
      });
    }); */

  }

  getAllTextData() {
    return this.textSamples;
  }

  getAllText() {
    return this.allText;
  }

  getTextSample(id) {
    return this.afs.doc('textSpeechTest/' + id).valueChanges();
  }

  getAppConfigText(id) {
    return this.afs.doc('textSpeechAppConfig/' + id).valueChanges();
  }
}
