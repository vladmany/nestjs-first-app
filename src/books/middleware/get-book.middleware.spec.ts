import { GetBookMiddleware } from './get-book.middleware';

describe('GetBookMiddleware', () => {
  it('should be defined', () => {
    expect(new GetBookMiddleware()).toBeDefined();
  });
});
