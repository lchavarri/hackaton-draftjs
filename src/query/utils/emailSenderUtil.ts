import { API, graphqlOperation } from 'aws-amplify';
import { createEmail } from '../graphql/mutations';

export async function sendEmail(args: any, documentId: any) {
  const { data } = (await API.graphql(
    graphqlOperation(createEmail, {
      input: {
        subject: 'New Ontology Request',
        message: `{"description": "${args.description}", "user": "${documentId}"}`,
        app_id: `${args.appName}`
      }
    })
  )) as { data: any };

  return data;
}
