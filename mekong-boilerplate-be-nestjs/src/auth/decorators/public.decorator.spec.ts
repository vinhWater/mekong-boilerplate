import { Public } from './public.decorator';
import { SetMetadata } from '@nestjs/common';

// Mock SetMetadata
jest.mock('@nestjs/common', () => ({
  SetMetadata: jest.fn().mockReturnValue('mocked-metadata'),
}));

describe('Public Decorator', () => {
  it('should call SetMetadata with correct parameters', () => {
    const result = Public();

    expect(SetMetadata).toHaveBeenCalledWith('isPublic', true);
    expect(result).toBe('mocked-metadata');
  });
});
