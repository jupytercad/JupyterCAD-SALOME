import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { requestAPI } from './handler';

/**
 * Initialization data for the jupytercad-salome extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupytercad-salome:plugin',
  description: 'A JupyterLab extension.',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension jupytercad-salome is activated!');

    requestAPI<any>('get-example')
      .then(data => {
        console.log(data);
      })
      .catch(reason => {
        console.error(
          `The jupytercad_salome server extension appears to be missing.\n${reason}`
        );
      });
  }
};

export default plugin;
