import React, {
  CSSProperties, forwardRef, useImperativeHandle, useMemo, useRef,
} from 'react';
import { useMountedState } from 'react-use';
import { CommonViewerJsProps } from './types';

interface ImageListProps extends CommonViewerJsProps {
  style?: CSSProperties;
}

const ImageList = forwardRef<{
  getInnerRef:() => HTMLUListElement | null, getMountState:() => boolean
}, ImageListProps>(
    ({
      imageUrls,
      imageListClassname,
      showImageList,
      style,
      customImageListComponent,
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

      return customImageListComponent ? (
        React.cloneElement(customImageListComponent, { ref })
      ) : (
        <ul ref={ref} className={imageListClassname} style={{ ...style, ...disableShowStyle }}>
          {imageUrls && imageUrls.length > 0 && imageUrls.map((imageUrl) => <li><img src={imageUrl} key={imageUrl} alt="" /></li>)}
        </ul>
      );
    });

ImageList.displayName = 'ImageList';

export default ImageList;
