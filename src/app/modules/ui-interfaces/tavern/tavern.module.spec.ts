import {TavernModule} from './tavern.module';

describe('TavernModule', () => {
  let tavernModule: TavernModule;

  beforeEach(() => {
    tavernModule = new TavernModule();
  });

  it('should create an instance', () => {
    expect(tavernModule).toBeTruthy();
  });
});
