import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TextToSpeech } from '@ionic-native/text-to-speech';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  speakingText: string = '';
  speakingLocale = 'en-US';
  speakingRate = 160;
  textToInsert = '';

  constructor(public navCtrl: NavController, private tts: TextToSpeech) {

  }

  updateText(userChoice) {
    let textDefaults = {
      anthropocene: 'The Anthropocene Epoch is an unofficial interval of geologic time, making up the third worldwide division of the Quaternary Period characterized as the time in which the collective activities of human beings began to substantially alter Earth’s surface, atmosphere, oceans, and systems of nutrient cycling.',
      pleistocene: 'The Pleistocene Epoch was the earlier and major of the two epochs that constitute the Quaternary Period of the Earth’s history, and the time period during which a succession of glacial and interglacial climatic cycles occurred.',
      science: 'Let’s pronounce some eon names: Hadean, Archean, Proterozoic, and Phanerozoic. Now some eras: Paleozoic, Mesozoic, Cenozoic, and the Flintstones era, during which Fred, Wilma, Barney, and Betty lived. And these time periods: Cambrian, Ordovician, Silurian, Devonian, Carboniferous, Permian, Triassic, Jurassic, Cretaceous, Really Delicious, Paleogene, Neogene, Phoney Baloney, and Quaternary.'
    }
    this.speakingText = textDefaults[userChoice];
  }

  speakText() {
    let options = {
      text: this.speakingText,
      locale: this.speakingLocale,
      rate: this.speakingRate / 100
    };

    this.tts.speak(options)
      .then(() => console.log('Success'))
      .catch((reason: any) => console.log(reason));
  }

  ionViewDidLoad() {
    this.updateText('anthropocene');
    this.textToInsert = 'anthropocene';
  }

}
