import React, {
  CSSProperties, forwardRef, useImperativeHandle, useMemo, useRef,
} from 'react';
import { useMountedState } from 'react-use';
import { ImageListProps } from './types';

const ImageList = forwardRef<{
  getInnerRef:() => HTMLUListElement | null, getMountState:() => boolean
}, ImageListProps>(
    ({
      imageUrls,
      imageListClassname,
      showImageList,
    }, refOut) => {
      const ref = useRef<HTMLUListElement>(null);

      const style: CSSProperties = useMemo(() => {
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
        <ul ref={ref} className={imageListClassname} style={style}>
          {imageUrls && imageUrls.length > 0 && imageUrls.map((imageUrl) => <li><img src={imageUrl} key={imageUrl} alt="" /></li>)}
        </ul>
      );
    });

ImageList.displayName = 'ImageList';

export default ImageList;
