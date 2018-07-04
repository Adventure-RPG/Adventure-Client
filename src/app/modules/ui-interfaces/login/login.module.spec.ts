import LoginModule from './login.module';

describe('LoginModule', () => {
  let loginModule;

  beforeEach(() => {
    loginModule = new LoginModule();
  });

  it('should create an instance', () => {
    expect(loginModule).toBeTruthy();
  });
});
