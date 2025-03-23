declare module 'express' {
  export interface Request {
    query: any;
  }

  export interface Response {
    json(body: any): this;
  }
  
  // Add the static middleware method
  namespace express {
    function static(path: string): any;
  }
}

declare module 'body-parser';