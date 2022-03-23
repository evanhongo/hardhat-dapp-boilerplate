const sleep = (t) =>
  new Promise((resolve: any) => {
    setTimeout(() => {
      resolve();
    }, t);
  });

export default sleep;
