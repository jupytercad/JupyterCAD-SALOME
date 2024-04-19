import { FormDialog, newName, setVisible } from '@jupytercad/base';
import {
  IDict,
  IJCadObject,
  IJupyterCadModel,
  IJupyterCadTracker,
  JCadWorkerSupportedFormat
} from '@jupytercad/schema';
import { JupyterFrontEnd } from '@jupyterlab/application';
import { showErrorMessage } from '@jupyterlab/apputils';
import { ITranslator } from '@jupyterlab/translation';

import { gridIcon } from './icon';
import formSchema from './schema.json';
import { WORKER_ID } from './worker';

export namespace CommandIDs {
  export const mesh = 'jupytercad:salome:mesh';
}
export function addCommands(
  app: JupyterFrontEnd,
  tracker: IJupyterCadTracker,
  translator: ITranslator
) {
  const trans = translator.load('jupyterlab');
  const { commands } = app;
  commands.addCommand(CommandIDs.mesh, {
    label: trans.__('Mesh creation'),
    isEnabled: () => Boolean(tracker.currentWidget),
    icon: gridIcon,
    execute: Private.executeMeshOperatorFactory(tracker)
  });
}

namespace Private {
  const meshOperator = {
    title: 'Mesh parameters',
    default: (model: IJupyterCadModel) => {
      const objects = model.getAllObject();
      const selected = model.localState?.selected?.value;
      let objectName = objects[0].name ?? '';
      if (selected) {
        for (const key in selected) {
          if (selected[key].type === 'shape') {
            objectName = key;
            break;
          }
        }
      }
      return {
        Name: newName('Mesh', model),
        Object: objectName,
        NumberOfSegments: 10
      };
    },
    syncData: (model: IJupyterCadModel) => {
      return (props: IDict) => {
        const { Name, ...parameters } = props;
        const objectModel: IJCadObject = {
          shape: 'Post::SalomeMesh' as any,
          parameters,
          visible: true,
          name: Name,
          shapeMetadata: {
            shapeFormat: JCadWorkerSupportedFormat.BREP,
            workerId: WORKER_ID
          }
        };
        const sharedModel = model.sharedModel;
        if (sharedModel) {
          sharedModel.transact(() => {
            if (parameters['Object'].length > 0) {
              setVisible(sharedModel, parameters['Object'], false);
            }

            if (!sharedModel.objectExists(objectModel.name)) {
              sharedModel.addObject(objectModel);
            } else {
              showErrorMessage(
                'The object already exists',
                'There is an existing object with the same name.'
              );
            }
          });
        }
      };
    }
  };

  export function executeMeshOperatorFactory(tracker: IJupyterCadTracker) {
    return async (args: any) => {
      const current = tracker.currentWidget;

      if (!current) {
        return;
      }

      const formJsonSchema = JSON.parse(JSON.stringify(formSchema));
      formJsonSchema['required'] = ['Name', ...formJsonSchema['required']];
      formJsonSchema['properties'] = {
        Name: { type: 'string', description: 'The Name of the Object' },
        ...formJsonSchema['properties']
      };
      const { ...props } = formJsonSchema;
      const dialog = new FormDialog({
        context: current.context,
        title: meshOperator.title,
        sourceData: meshOperator.default(current.context.model),
        schema: props,
        syncData: meshOperator.syncData(current.context.model),
        cancelButton: true
      });
      await dialog.launch();
    };
  }
}
