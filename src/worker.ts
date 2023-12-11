import {
  IDict,
  IJCadWorker,
  IWorkerMessageBase,
  MainAction,
  WorkerAction
} from '@jupytercad/schema';
import { PromiseDelegate } from '@lumino/coreutils';
import { v4 as uuid } from 'uuid';

import { AppClient, ExecutionRequest, ExecutionResponse } from './_client';

export class SalomeWorker implements IJCadWorker {
  constructor(options: SalomeWorker.IOptions) {
    this._appClient = options.appClient;
  }

  get ready(): Promise<void> {
    return this._ready.promise;
  }

  register(options: {
    messageHandler: ((msg: any) => void) | ((msg: any) => Promise<void>);
    thisArg?: any;
  }): string {
    const { messageHandler, thisArg } = options;
    const id = uuid();
    if (thisArg) {
      messageHandler.bind(thisArg);
    }
    this._messageHandlers.set(id, messageHandler);
    return id;
  }

  unregister(id: string): void {
    this._messageHandlers.delete(id);
  }

  postMessage(msg: IWorkerMessageBase): void {
    if (msg.action !== WorkerAction.POSTPROCESS) {
      return;
    }
    if (msg.payload && Object.keys(msg.payload).length > 0) {
      const promises: Promise<ExecutionResponse>[] = [];
      const jcObjects: IDict[] = [];
      for (const key in msg.payload) {
        const item = msg.payload[key] as { occBrep: string; jcObject: IDict };
        const numberOfSegments =
          item.jcObject?.parameters?.NumberOfSegment ?? 15;
        const res = this._appClient.execute.generateMesh({
          requestBody: {
            geometry: item.occBrep,
            format: ExecutionRequest.format.BREP,
            numberOfSegments
          }
        });
        promises.push(res);
        jcObjects.push(item.jcObject);
      }
      Promise.all(promises).then(allRes => {
        const id = msg.id;
        const payload: { jcObject: IDict; postResult: ExecutionResponse }[] =
          [];
        allRes.forEach((postResult, idx) =>
          payload.push({ postResult, jcObject: jcObjects[idx] })
        );
        const handler = this._messageHandlers.get(id);
        if (handler) {
          handler({ action: MainAction.DISPLAY_POST, payload });
        }
      });
    }
  }
  private _ready = new PromiseDelegate<void>();
  private _messageHandlers = new Map();
  private _appClient: AppClient;
}

export namespace SalomeWorker {
  export interface IOptions {
    appClient: AppClient;
  }
}
