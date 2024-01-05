export const snapshotToArray = (snapshot: any) => {
  const result: any[] = [];
  for (const key in snapshot) {
    if (snapshot.hasOwnProperty(key)) {
      result.push(snapshot[key]);
    }
  }
  return result;
};
