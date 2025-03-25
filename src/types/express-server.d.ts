declare module 'express' {
  import * as http from 'http';

  interface Request {
    query: {
      [key: string]: string | string[] | undefined;
    };
  }

  interface Response {
    json(body: any): this;
  }
}
