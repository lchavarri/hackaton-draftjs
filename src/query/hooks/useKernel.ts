import { useContext, useEffect, useState } from 'react';
import { Context } from '../../shared/ui/main/main';
import JupyterService, { IKernel } from '../../shared/ui/services/jupyterService';

export const kernelUnresponsiveMessage =
  'Eidos session unresponsive. Tip: Make sure you have a connected Session Manager Live App in your Quip document.';

export type ErrorObject = {
  message: string;
};
// Kernel fetching hook
export default function useKernel(): [
  IKernel | undefined,
  boolean,
  ErrorObject | undefined
] {
  const { documentId } = useContext(Context);
  const [kernel, setKernel] = useState<IKernel>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorObject>();

  useEffect(() => {
    const errorObject: ErrorObject = { message: kernelUnresponsiveMessage };

    async function fetchKernel() {
      try {
        await JupyterService.getNotebook(documentId);
        const kernelModel = await JupyterService.getNotebookKernel();

        if (kernelModel) {
          const kernel = await JupyterService.connectToKernel(kernelModel);
          setKernel(kernel);
        } else {
          setError(errorObject);
        }
        setLoading(false);
      } catch (error) {
        setError(errorObject);
        setLoading(false);
      }
    }

    fetchKernel();
  }, [documentId]);

  return [kernel, loading, error];
}
