import 'express';

declare module 'express-serve-static-core' {
  interface Request {
    auth?: {
      userId: string;
      role: string;
    };
  }
}

declare module 'bcryptjs' {
  const bcrypt: {
    hash(password: string, salt: number): Promise<string>;
    compare(password: string, hash: string): Promise<boolean>;
  };
  export default bcrypt;
}

declare module 'jsonwebtoken' {
  const jwt: {
    sign(payload: unknown, secret: string, options?: { expiresIn?: string | number }): string;
    verify(token: string, secret: string): unknown;
  };
  export default jwt;
}

declare module 'node-cron' {
  const cron: {
    schedule(expression: string, callback: () => void | Promise<void>): unknown;
  };
  export default cron;
}
