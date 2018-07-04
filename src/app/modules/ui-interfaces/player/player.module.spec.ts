import PlayerModule from './player.module';

describe('PlayerModule', () => {
  let playerModule;

  beforeEach(() => {
    playerModule = new PlayerModule();
  });

  it('should create an instance', () => {
    expect(playerModule).toBeTruthy();
  });
});
