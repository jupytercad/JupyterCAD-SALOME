import {
  IJCadExternalCommandRegistry,
  IJCadExternalCommandRegistryToken,
  IJCadFormSchemaRegistry,
  IJCadFormSchemaRegistryToken,
  IJCadWorkerRegistry,
  IJCadWorkerRegistryToken,
  IJupyterCadDocTracker,
  IJupyterCadTracker
} from '@jupytercad/schema';
import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { URLExt } from '@jupyterlab/coreutils';
import { ServerConnection } from '@jupyterlab/services';
import { ITranslator, nullTranslator } from '@jupyterlab/translation';

import { AppClient } from './_client/AppClient';
import { CommandIDs, addCommands } from './command';
import { API_NAMESPACE, requestAPI } from './handler';
import formSchema from './schema.json';
import { SalomeWorker } from './worker';

/**
 * Initialization data for the jupytercad-salome extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupytercad-salome:plugin',
  description: 'JupyterCad Salome plugin.',
  autoStart: true,
  requires: [
    IJCadWorkerRegistryToken,
    IJCadFormSchemaRegistryToken,
    IJupyterCadDocTracker,
    IJCadExternalCommandRegistryToken
  ],
  optional: [ITranslator],
  activate: async (
    app: JupyterFrontEnd,
    workerRegistry: IJCadWorkerRegistry,
    schemaRegistry: IJCadFormSchemaRegistry,
    tracker: IJupyterCadTracker,
    externalCommandRegistry: IJCadExternalCommandRegistry,
    translator?: ITranslator
  ) => {
    console.log('jupytercad:salome is activated!');

    translator = translator ?? nullTranslator;
    const settings = ServerConnection.makeSettings();
    const getBackendUrl = URLExt.join(API_NAMESPACE, 'get-backend');
    const data = await requestAPI<{
      backend_url?: string;
    }>(getBackendUrl);
    let serverURL = '';
    if (data.backend_url) {
      serverURL = data.backend_url;
    } else {
      serverURL = settings.baseUrl.replace(/\/$/, '');
    }

    const appClient = new AppClient({
      BASE: serverURL,
      TOKEN: settings.token
    });
    const worker = new SalomeWorker({ appClient, tracker });
    workerRegistry.registerWorker('jupytercad-salome:worker', worker);
    schemaRegistry.registerSchema('Post::SalomeMesh', formSchema);

    addCommands(app, tracker, translator);
    externalCommandRegistry.registerCommand({
      name: 'Mesh Creation',
      id: CommandIDs.mesh
    });
  }
};

export default [plugin];
