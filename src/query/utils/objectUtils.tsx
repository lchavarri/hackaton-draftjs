export function cloneObject(object: any) {
  return JSON.parse(JSON.stringify(object));
}

// Function to remove empty strings recursively
// DynamoDB does not accept empty strings on AWSJSON objects
export function removeEmpty(obj: any) {
  const assignNull = (key: any) => {
    obj[key] = null;
  };

  Object.keys(obj).forEach(
    k =>
      (obj[k] && typeof obj[k] === 'object' && removeEmpty(obj[k])) ||
      (!obj[k] && obj[k] !== undefined && assignNull(k))
  );
  return obj;
}

// Function to parse strings as objects conditionally for AWSJSON objects
export const parseAWSString = (obj: string | any[] | undefined = []) =>
  typeof obj === 'string' ? JSON.parse(obj) : obj;
