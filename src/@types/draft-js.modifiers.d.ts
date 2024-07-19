declare module 'draft-js-modifiers' {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export function adjustBlockDepth(contentState: any, selectionState: any, adjustment: number, maxDepth: number): any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export function mergeBlockDataByKey(contentState: any, blockKey: string, data: object): any;
    // Thêm các khai báo khác nếu cần
  }