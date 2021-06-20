import React, {
  CSSProperties, forwardRef, useImperativeHandle, useMemo, useRef,
} from 'react';
import { useMountedState } from 'react-use';
import { Interface } from 'readline';
import { CommonViewerJsProps } from './types';

type ImageListProps = CommonViewerJsProps;

const ImageList = forwardRef<{
  getInnerRef:() => HTMLUListElement | null, getMountState:() => boolean
}, ImageListProps>(
    ({
      imageUrls,
      imageListClassname,
      showImageList,
      style,
    }, refOut) => {
      const ref = useRef<HTMLUListElement>(null);

      const disableShowStyle = useMemo<CSSProperties>(() => {
        if (!showImageList) {
          return {
            height: '0px',
            overflow: 'hidden',
          };
        }
        return {};
      }, [showImageList]);

      const mountState = useMountedState();

      useImperativeHandle(refOut, () => ({
        getMountState: () => mountState(),
        getInnerRef: () => ref.current,
      }));

      return (
        <ul ref={ref} className={imageListClassname} style={{ ...style, ...disableShowStyle }}>
          {imageUrls && imageUrls.length > 0 && imageUrls.map((imageUrl) => <li><img src={imageUrl} key={imageUrl} alt="" /></li>)}
        </ul>
      );
    });

ImageList.displayName = 'ImageList';

export default ImageList;
