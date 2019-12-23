export const expectToThrow = (
  asyncPromise: Promise<any>,
  doneCb: Function,
  errorMsg?: string
) => {
  asyncPromise
    .then(data => {
      expect(data).toBeUndefined();
      doneCb();
    })
    .catch(error => {
      expect(error).toBeDefined();
      if (errorMsg) {
        expect(error).toMatchObject({
          message: expect.stringContaining(errorMsg)
        });
      }
      doneCb();
    });
};
