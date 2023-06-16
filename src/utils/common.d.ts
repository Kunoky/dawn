declare interface treeNode {
  id: string | number
  children?: treeNode[]
  meta?: string | object
}

export declare function arr2tree(arr: treeNode[]): [treeNode[], { [key: string]: treeNode }]

export declare function tree2arr(tree: treeNode[], key: string, arr: any[]): any[]

export declare function hasBit(num: number, n: number): boolean
