import { Logger } from '@nestjs/common';
import { DataSource, EntityManager, QueryRunner } from 'typeorm';

/**
 * Executes a function within a database transaction
 * @param connection TypeORM connection
 * @param operation Function to execute within the transaction
 * @param logger Optional logger instance
 * @returns Result of the operation
 */
export async function executeInTransaction<T>(
  dataSource: DataSource,
  operation: (entityManager: EntityManager) => Promise<T>,
  logger?: Logger,
): Promise<T> {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    // Execute the operation with the transaction's entity manager
    const result = await operation(queryRunner.manager);

    // Commit the transaction
    await queryRunner.commitTransaction();
    return result;
  } catch (error) {
    // Rollback the transaction on error
    await queryRunner.rollbackTransaction();
    if (logger) {
      logger.error(`Transaction failed: ${error.message}`, error.stack);
    }
    throw error;
  } finally {
    // Release the query runner
    await queryRunner.release();
  }
}

/**
 * Creates a transaction context that can be used to execute multiple operations
 * @param connection TypeORM connection
 * @returns Transaction context with methods to execute operations and manage the transaction
 */
export async function createTransactionContext(dataSource: DataSource) {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  return {
    manager: queryRunner.manager,

    async commit(): Promise<void> {
      await queryRunner.commitTransaction();
      await queryRunner.release();
    },

    async rollback(): Promise<void> {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
    },

    async execute<T>(
      operation: (entityManager: EntityManager) => Promise<T>,
    ): Promise<T> {
      try {
        return await operation(queryRunner.manager);
      } catch (error) {
        await this.rollback();
        throw error;
      }
    },
  };
}
