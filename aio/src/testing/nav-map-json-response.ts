import { Response } from '@angular/http';

// tslint:disable:quotemark
export function getTestNavMapResponse(): Response {

  const navMapJson = { "nodes": [
  ]};

  // tslint:enable:quotemark
  return {
    status: 200,
    json: () => navMapJson
  } as Response;
}
