import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Custom decorator to extract the current user or a specific user property from the request.
 *
 * Usage examples:
 * - @CurrentUser() user: User - Gets the entire user object
 * - @CurrentUser('id') userId: number - Gets only the user ID
 * - @CurrentUser('email') email: string - Gets only the user email
 *
 * This decorator works with the JWT authentication strategy where the user
 * is attached to the request object by the JwtStrategy.
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // If no user is found in the request, return null
    if (!user) {
      return null;
    }

    // If data is provided, return the specific property
    // Example: @CurrentUser('id') will return user.id
    return data ? user?.[data] : user;
  },
);
