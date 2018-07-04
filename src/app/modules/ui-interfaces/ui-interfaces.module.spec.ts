import UiInterfacesModule from './ui-interfaces.module';

describe('UiInterfacesModule', () => {
  let uiInterfacesModule;

  beforeEach(() => {
    uiInterfacesModule = new UiInterfacesModule();
  });

  it('should create an instance', () => {
    expect(uiInterfacesModule).toBeTruthy();
  });
});
