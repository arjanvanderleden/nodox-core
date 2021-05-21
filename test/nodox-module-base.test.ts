import { DemoModule } from './mocks/module';

describe('NodoxModuleBase', () => {
  let warn: any;

  beforeEach(() => {
    warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warn.mockReset();
  });

  it('merges a module without importing definitions with identical full names', () => {
    const module1 = new DemoModule();
    const module2 = new DemoModule();
    module2.definitions = module2.definitions.map(definition => ({
      ...definition,
      fullName: definition.fullName.replace('nodox.module.mock', 'nodox.module.mock2'),
    }));
    const definitionLength = module1.definitions.length;
    expect(typeof module1.merge).toBe('function');

    module1.merge(module2);
    expect(module1.definitions.length).toBe(definitionLength + module2.definitions.length);
  });

  it('merges a module without importing definitions with identical full names', () => {
    const module1 = new DemoModule();
    const module2 = new DemoModule();
    const definitionLength = module1.definitions.length;
    expect(typeof module1.merge).toBe('function');

    module1.merge(module2);
    expect(module1.definitions.length).toBe(definitionLength);
  });
});
