import { CardinalPage } from './app.po';

describe('Cardinal App', () => {
  let page: CardinalPage;

  beforeEach(() => {
    page = new CardinalPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
