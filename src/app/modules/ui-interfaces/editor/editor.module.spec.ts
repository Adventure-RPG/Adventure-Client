import EditorModule from './editor.module';

describe('EditorModule', () => {
  let editorModule;

  beforeEach(() => {
    editorModule = new EditorModule();
  });

  it('should create an instance', () => {
    expect(editorModule).toBeTruthy();
  })
});
