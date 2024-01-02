type ClassDict = { [key: string]: boolean };
type StringOrClassDict = string | ClassDict;
const isClassDict = (
  stringOrClassDict: StringOrClassDict
): stringOrClassDict is ClassDict => typeof stringOrClassDict === "object";
export const classNames = (...classes: StringOrClassDict[]) => {
  return classes
    .reduce((acc: string[], cls) => {
      if (isClassDict(cls)) {
        Object.entries(cls).forEach(([k, v]) => {
          if (v) {
            acc.push(k);
          }
        });
      } else {
        acc.push(cls);
      }
      return acc;
    }, [])
    .join(" ");
};
