declare module 'express' {
  export interface Request {
    query: {
      [key: string]: string | string[] | undefined;
    };
  }

  export interface Response {
    json(body: any): this;
  }

  export default function express(): express.Application;
  export namespace express {
    function static(path: string): any;
    
    interface Application {
      use(middleware: any): this;
      get(path: string, handler: (req: Request, res: Response) => void): this;
      listen(port: number | string, callback?: () => void): any;
    }
  }
}
