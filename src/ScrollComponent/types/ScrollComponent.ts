import React from 'react';

export interface IScrollComponent {
    width: number;
    height: number;
    data: any[],
    ListWrapper: any,
    rowHeight: number,
    bufferRowCount?: number;
    getRow(rowData: any): React.ReactNode,
    onMouseLeave?(): void,
}
