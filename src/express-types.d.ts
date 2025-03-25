import * as express from 'express';

declare global {
  namespace Express {
    interface Response {
      // Fix the json method to accept any type of data
      json(body?: any): express.Response;
    }
  }
}

// To make this file a module
export {};
