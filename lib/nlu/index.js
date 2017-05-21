'use strict';
const dotenv = require('dotenv');
const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1');

class NaturalLanguageUnderstanding {
  constructor() {
    dotenv.config();
    this.nlu = new NaturalLanguageUnderstandingV1({
      username: process.env.NATURAL_LANGUAGE_UNDERSTANDING_USERNAME,
      password: process.env.NATURAL_LANGUAGE_UNDERSTANDING_PASSWORD,
      version_date: NaturalLanguageUnderstandingV1.VERSION_DATE_2017_02_27
    });
  }

  analyze(text) {
    return new Promise((resolve, reject) => {
      
      const options = {
        'text': text,
        'features': {
          'entities': {},
          'keywords': {},
          'concepts': {},
        },
      };
      
      this.nlu.analyze(options, (error, response) => {
        console.log(error, response);
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
    });
  }
}

module.exports = NaturalLanguageUnderstanding;