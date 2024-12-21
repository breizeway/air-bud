type ClassDict = { [classNames: string]: boolean };
export type ClassNames = string | ClassDict | undefined;
const isClassDict = (
  stringOrClassDict: ClassNames
): stringOrClassDict is ClassDict => typeof stringOrClassDict === "object";
export const classNames = (...classes: ClassNames[]) => {
  return classes
    .reduce((acc: string[], cls) => {
      if (isClassDict(cls)) {
        Object.entries(cls).forEach(([k, v]) => {
          if (v) {
            acc.push(k);
          }
        });
      } else if (cls) {
        acc.push(cls);
      }
      return acc;
    }, [])
    .join(" ");
};
