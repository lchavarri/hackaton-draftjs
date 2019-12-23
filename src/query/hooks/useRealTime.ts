import { useEffect, useContext } from 'react';
import { API, graphqlOperation } from 'aws-amplify';

import { getEidosQueryUi, listAllEidosQueryUis } from '../graphql/queries';
import { createEidosQueryUi, updateEidosQueryUi } from '../graphql/mutations';
import { removeEmpty } from '../utils/objectUtils';
import { Context } from '../../shared/ui/main/main';

let closureCallback: Function = () => {};
const defaultVariableName = 'dataset_';

export default function useRealTime(callback?: Function) {
  const { liveAppInstanceId, documentId } = useContext(Context);
  closureCallback = callback || closureCallback;

  const app_instance_id = liveAppInstanceId;
  const document_id = documentId;
  async function updateLiveAppContent(contentData: any, active_user: string) {
    // Parsing content to AWSJSON preferred format
    const content = JSON.stringify(removeEmpty(contentData));
    try {
      await API.graphql(
        graphqlOperation(updateEidosQueryUi, {
          input: {
            app_instance_id,
            document_id,
            content,
            active_user
          }
        })
      );
    } catch (e) {
      console.log(e);
    }
  }

  const getDataSetNumber = async () => {
    let number = 1;
    try {
      const {
        data: { listAllEidosQueryUIS: list }
      } = (await API.graphql(
        graphqlOperation(listAllEidosQueryUis, {
          filter: {
            document_id: {
              eq: document_id
            },
            pythonVariableName: {
              beginsWith: defaultVariableName
            }
          }
        })
      )) as { data: { listAllEidosQueryUIS: any } };
      if (list && list.items.length) {
        const pattern = `${defaultVariableName}(\\d+)$`;

        const map = list.items.map((item: any) => {
          const arr = item.pythonVariableName.split('_');

          return RegExp(pattern).test(item.pythonVariableName) ? ++arr[1] : 1;
        });

        number = Math.max.apply(null, map);
      }
    } catch (e) {
      console.error(e);
    }

    return number;
  };

  useEffect(() => {
    async function fetchApp() {
      try {
        // Fetch live app
        const liveAppData = (await API.graphql(
          graphqlOperation(getEidosQueryUi, {
            document_id,
            app_instance_id
          })
        )) as { data: any };

        // If live app has not been recorded, create it;
        if (!liveAppData.data || !liveAppData.data.getEidosQueryUI) {
          const variableNumber = await getDataSetNumber();
          const body = {
            app_instance_id,
            document_id,
            pythonVariableName: `${defaultVariableName}${variableNumber}`,
            content: '{}'
          };

          const liveAppData = (await API.graphql(
            graphqlOperation(createEidosQueryUi, { input: body })
          )) as { data: any };

          const liveAppState = liveAppData.data.createEidosQueryUI;

          closureCallback(liveAppState);
        } else {
          const liveAppState = liveAppData.data.getEidosQueryUI;

          closureCallback(liveAppState);
        }
      } catch (e) {
        console.log(e);
      }
    }

    fetchApp();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app_instance_id, document_id]);

  return { updateLiveAppContent };
}
