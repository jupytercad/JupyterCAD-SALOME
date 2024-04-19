import {
  IDisplayPost,
  IJCadObject,
  IJCadWorker,
  IJupyterCadTracker,
  IPostOperatorInput,
  IPostResult,
  JCadWorkerSupportedFormat,
  MainAction,
  WorkerAction
} from '@jupytercad/schema';
import { showErrorMessage } from '@jupyterlab/apputils';
import { PromiseDelegate } from '@lumino/coreutils';
import { v4 as uuid } from 'uuid';

import { AppClient, ExecutionRequest } from './_client';

export const WORKER_ID = 'jupytercad-salome-worker';
export class SalomeWorker implements IJCadWorker {
  constructor(options: SalomeWorker.IOptions) {
    this._appClient = options.appClient;
    this._tracker = options.tracker;
  }

  get ready(): Promise<void> {
    return this._ready.promise;
  }
  shapeFormat = JCadWorkerSupportedFormat.BREP;

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

  postMessage(msg: {
    id: string;
    action: WorkerAction;
    payload?: IPostOperatorInput;
  }): void {
    if (msg.action !== WorkerAction.POSTPROCESS) {
      return;
    }

    if (msg.payload) {
      const { jcObject, postShape } = msg.payload;
      if (!postShape) {
        return;
      }

      const numberOfSegments = jcObject?.parameters?.NumberOfSegments ?? 15;
      const p = this._appClient.execute.generateMesh({
        requestBody: {
          sourcePath: this._tracker.currentWidget?.context.path,
          geometry: postShape as string,
          format: ExecutionRequest.format.BREP,
          numberOfSegments
        }
      });

      p.then(postResponse => {
        const id = msg.id;
        const payload: {
          jcObject: IJCadObject;
          postResult: IPostResult;
        }[] = [];
        if (postResponse.error) {
          showErrorMessage('Execution Error', postResponse.error);
        } else {
          payload.push({
            postResult: {
              format: 'STL',
              binary: true,
              value: postResponse.mesh
            },
            jcObject
          });
        }
        if (payload.length > 0) {
          const handler: (msg: IDisplayPost) => void =
            this._messageHandlers.get(id);
          if (handler) {
            handler({ action: MainAction.DISPLAY_POST, payload });
          }
        }
      });
    }
  }
  private _ready = new PromiseDelegate<void>();
  private _messageHandlers = new Map();
  private _appClient: AppClient;
  private _tracker: IJupyterCadTracker;
}

export namespace SalomeWorker {
  export interface IOptions {
    appClient: AppClient;
    tracker: IJupyterCadTracker;
  }
}
