import { Test, TestingModule } from '@nestjs/testing';
import { GlobalAuthGuard } from './global-auth.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';

// Create mock function for JwtAuthGuard.canActivate
const mockJwtAuthGuardCanActivate = jest.fn();

// Mock JwtAuthGuard
jest.mock('./jwt-auth.guard', () => {
  return {
    JwtAuthGuard: jest.fn().mockImplementation(() => ({
      canActivate: mockJwtAuthGuardCanActivate,
    })),
  };
});

describe('GlobalAuthGuard', () => {
  let guard: GlobalAuthGuard;
  let mockGetAllAndOverride: jest.Mock;

  beforeEach(async () => {
    // Reset mocks
    mockGetAllAndOverride = jest.fn();
    mockJwtAuthGuardCanActivate.mockClear();
    mockJwtAuthGuardCanActivate.mockReturnValue(true);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GlobalAuthGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: mockGetAllAndOverride,
          },
        },
      ],
    }).compile();

    guard = module.get<GlobalAuthGuard>(GlobalAuthGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true for public routes', () => {
      // Mock context
      const context = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
      } as unknown as ExecutionContext;

      // Mock reflector to return true for isPublic
      mockGetAllAndOverride.mockReturnValue(true);

      const result = guard.canActivate(context);

      expect(mockGetAllAndOverride).toHaveBeenCalledWith('isPublic', [
        context.getHandler(),
        context.getClass(),
      ]);
      expect(result).toBe(true);
    });

    it('should use JwtAuthGuard for protected routes', () => {
      // Mock context
      const context = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
      } as unknown as ExecutionContext;

      // Mock reflector to return false for isPublic
      mockGetAllAndOverride.mockReturnValue(false);

      // Mock JwtAuthGuard.canActivate to return true
      mockJwtAuthGuardCanActivate.mockReturnValue(true);

      const result = guard.canActivate(context);

      expect(mockGetAllAndOverride).toHaveBeenCalledWith('isPublic', [
        context.getHandler(),
        context.getClass(),
      ]);
      expect(mockJwtAuthGuardCanActivate).toHaveBeenCalledWith(context);
      expect(result).toBe(true);
    });
  });
});
