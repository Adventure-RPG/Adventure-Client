import { browser, element, by } from 'protractor';

export class AdventurePage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('adventure-root h1')).getText();
  }
}
