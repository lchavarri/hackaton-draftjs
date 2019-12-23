import SharedbClient from "./SharedbClient";
import diffMatchPatch from "diff-match-patch";
import jsondiff from "json0-ot-diff";
import { Doc } from "sharedb";

export const connectEditor = async (
  id: string,
  initialData: any,
  callback: Function
) => {
  try {
    const doc = await getEditor(id);
    if (!doc.type) {
      doc.create(initialData);
    }

    doc.subscribe(err => {
      if (err) {
        throw err;
      }
      console.log("$$$ subscription next: ", doc.data);
      callback(doc.data);
    });
  } catch (error) {
    console.error(error);
  }
};

const getEditor = async (editorId: string): Promise<Doc> => {
  const doc = SharedbClient.get("editors", editorId);
  return new Promise((resolve, reject) => {
    doc.fetch(err => {
      if (err) {
        return reject(err);
      }
      resolve(doc);
    });
  });
};

export const updateEditor = async (id: string, oldData: any, newData: any) => {
  const operations = jsondiff(oldData, newData, diffMatchPatch);
  if (!operations.length) {
    return;
  }
  try {
    const doc = await getEditor(id);
    doc.submitOp(operations, {}, err => {
      if (err) {
        throw err;
      }
    });
  } catch (error) {
    console.error(error);
  }
};
