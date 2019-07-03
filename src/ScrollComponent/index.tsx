import React from 'react';

import { IScrollComponent } from './types';
import { DEFAULT_BUFFER_ROW_COUNT } from './constants';

const ScrollComponent = ({
   width,
   height,
   ListWrapper,
   onMouseLeave,
   getRow,
   data,
   rowHeight,
   bufferRowCount = DEFAULT_BUFFER_ROW_COUNT,
}: IScrollComponent) => {
    const [rowCount, setRowCount] = React.useState<number>(0);
    const [scrollPosition, setScrollPosition] = React.useState<number>(0);
    const renderRow = React.useCallback((rowData) => getRow(rowData), []);

    const onScroll = React.useCallback((e) => {
        const { scrollTop } = e.target;
        setScrollPosition(scrollTop);
    }, []);

    React.useEffect(() => {
        const nextRowCount =
            Math.floor(height / rowHeight) + bufferRowCount * 2;
        setRowCount(nextRowCount);
    }, [height]);


    const rows = () => {
        const offset = Math.min(
            Math.floor(scrollPosition / rowHeight),
            Math.max(Math.round(data.length - rowCount), 0)
        );

        const result = [];

        let startIndex = 0;
        let endIndex = data.length;

        if (data.length > rowCount) {
            const topOffset = offset - bufferRowCount;
            const bottomOffset = topOffset < 0 ? Math.abs(topOffset) : 0;

            startIndex = Math.max(topOffset, 0);
            endIndex = Math.min(
                rowCount + offset + bottomOffset,
                data.length
            );
        }

        for (let i = startIndex; i < endIndex; i++) {
            result.push(renderRow(data[i]));
        }

        return result;
    };

    const list = React.useMemo(() => {
        const dataHeight = data.length * rowHeight;

        const delta = Math.max(scrollPosition - bufferRowCount * rowHeight, 0);

        const compensationTop = Math.max(
            Math.min(
                delta - (delta % rowHeight),
                dataHeight -
                rowCount * rowHeight -
                bufferRowCount * rowHeight
            ),
            0
        );

        const compensationBottom = Math.max(
            dataHeight -
            (rowCount * rowHeight +
                compensationTop +
                bufferRowCount * rowHeight),
            0
        );

        return (
            <ListWrapper
                onMouseLeave={onMouseLeave}
                compensationTop={compensationTop}
                compensationBottom={compensationBottom}
            >
                {rows()}
            </ListWrapper>
        );
    }, [
        width,
        height,
        data,
        scrollPosition,
        rowCount,
    ]);

    return (
        <div
            style={{width, height}}
            onScroll={onScroll}
        >
            {list}
        </div>
    );
};

export default ScrollComponent;
