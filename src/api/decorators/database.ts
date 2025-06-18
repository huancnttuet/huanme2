/* eslint-disable @typescript-eslint/no-explicit-any */
import { connectDB as connect } from '@/lib/mongodb';

export function connectDB(target: any) {
  const methodNames = Object.getOwnPropertyNames(target.prototype).filter(
    (name) =>
      name !== 'constructor' && typeof target.prototype[name] === 'function',
  );

  methodNames.forEach((name) => {
    const originalMethod = target.prototype[name];
    target.prototype[name] = async function (...args: any[]) {
      try {
        await connect();
        const data = await originalMethod.apply(this, args);

        return { data: JSON.parse(JSON.stringify(data)), success: true };
      } catch (error) {
        console.error(`Error in ${name}:`, error);
        throw new Error(
          `Database operation failed in ${name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
      }
    };
  });
}
