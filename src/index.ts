import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { URLExt } from '@jupyterlab/coreutils';
import { requestAPI, API_NAMESPACE } from './handler';
import { SalomeWorker } from './worker';
import { AppClient } from './_client/AppClient';
import {
  IJCadWorkerRegistry,
  IJCadWorkerRegistryToken
} from '@jupytercad/schema';
import { ServerConnection } from '@jupyterlab/services';

/**
 * Initialization data for the jupytercad-salome extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupytercad-salome:plugin',
  description: 'A JupyterLab extension.',
  autoStart: true,
  requires: [IJCadWorkerRegistryToken],
  activate: async (
    app: JupyterFrontEnd,
    workerRegistry: IJCadWorkerRegistry
  ) => {
    console.log('jupytercad:salome is activated!');

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
    const worker = new SalomeWorker({ appClient });

    workerRegistry.registerWorker('jupytercad-salome:worker', worker);
  }
};

export default plugin;
