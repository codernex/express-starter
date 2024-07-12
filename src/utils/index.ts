export const prettyError = (err: any, from?: string) => {
  let errMessage: string = "";
  if (err instanceof Error) {
    errMessage = err.message;
  } else if (typeof err === "string") {
    errMessage = err;
  }

  const cause = errMessage.split("'")[1] || errMessage.split('"')[1];
  if (err?.errno === 1451) {
    errMessage =
      "Cannot delete this data, Maybe some other data connected with this";
  }
  if (errMessage.includes("Duplicate")) {
    errMessage = `${from} already exists with ${cause}`;
  } else if (errMessage.includes("not find")) {
    errMessage = `${cause} not found with ${JSON.stringify(err?.criteria)}`;
  } else {
    // eslint-disable-next-line no-self-assign
    errMessage = errMessage;
  }
  return errMessage;
};
