export class Utils {
  static enumToArray(enumObject: { [key: string]: number }): { id: number; name: string }[] {
    return Object.keys(enumObject).map(key => ({ id: enumObject[key], name: key }));
  }

}
