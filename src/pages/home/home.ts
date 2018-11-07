import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { TextSamplesProvider } from '../../providers/text-samples/text-samples';
import { Observable } from 'rxjs';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
import { MobileAccessibility } from '@ionic-native/mobile-accessibility';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  speakingText: string = '';
  speakingLocale = 'en-US';
  speakingRate = 160;
  textToInsert = '';
  headerText: string = '';

  speaking : boolean = false;

  screenReaderRunning: string = 'Screen reader not available.';
  voiceOverRunning: string = 'VoiceOver not available';

  private allText: Observable<any>;
  private allTextData: AngularFirestoreCollection<any>;

  constructor(public navCtrl: NavController, private tts: TextToSpeech, 
    private textProvider: TextSamplesProvider, private mobileAccessibility: MobileAccessibility) {
    this.allText = this.textProvider.getAllText();
    this.allTextData = this.textProvider.getAllTextData();
  }

  updateText(userChoice) {
    if(userChoice) {
      let selItem = this.textProvider.getTextSample(userChoice);
      selItem.subscribe(val => {
        this.speakingText = val['text'];
      });
    }
  }

  speakText() {
    let options = {
      text: this.speakingText,
      locale: this.speakingLocale,
      rate: this.speakingRate / 100
    };

    this.tts.speak(options)
      .then(() => {
        this.speaking=true;
        console.log('Speaking');
      })
      .catch((reason: any) => {
        this.speaking=false;
        console.log(reason);
      });
  }

  stopText() {
    //this.tts.stop(); //this doesn't work? oh well
    this.tts.speak({text: ''}).then(()=>{
      this.speaking=false;
    });
  }

  ionViewDidLoad() {
    //keep this here for now while testing.
    console.log(this.allText);

    if(this.mobileAccessibility.isScreenReaderRunning()) {
      this.screenReaderRunning = 'Screen reader available.';
    }

    if(this.mobileAccessibility.isVoiceOverRunning()) {
      this.voiceOverRunning = 'VoiceOver available.';
    }

    this.textProvider.getAppConfigText('headerText').subscribe(val => {
      this.headerText = val['text'];
    });

    this.allTextData.ref.get().then((docs) => {
      docs.forEach((doc) => {
        let me = doc.data();
        if(me.displayOrder == 0) {
          this.updateText(doc.id);
          this.textToInsert = doc.id;
        }
      });
    });
  }
}
