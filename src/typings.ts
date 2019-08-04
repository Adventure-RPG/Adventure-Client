
// declare module 'Inflate';


export interface TreeElement {
  title: string;
  key: string;
  element: Element;
  children: any[];
  expanded: boolean;
  selected: boolean;
  checked: boolean;
}
