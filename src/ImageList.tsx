import * as React from 'react';
import { useMountedState } from 'react-use';
import { CommonViewerJsProps } from './types';

interface ImageListProps extends CommonViewerJsProps {
  style?: React.CSSProperties;
}

const ImageList = React.forwardRef<{
  getInnerRef:() => HTMLUListElement | null, getMountState:() => boolean
}, ImageListProps>(
    ({
      imageUrls,
      imageListClassname,
      showImageList = false,
      style,
      customImageListComponent,
      title,
      thumbnailsUrl,
      thumbnailLoadingType = 'eager',
      preloadImage,
    }, refOut) => {
      const ref = React.useRef<HTMLUListElement>(null);

      const disableShowStyle = React.useMemo<React.CSSProperties>(() => {
        if (!showImageList) {
          return {
            height: '0px',
            overflow: 'hidden',
          };
        }
        return {};
      }, [showImageList]);

      const mountState = useMountedState();

      React.useImperativeHandle(refOut, () => ({
        getMountState: () => mountState(),
        getInnerRef: () => ref.current,
      }));

      React.useEffect(() => {
        if (preloadImage) {
          imageUrls.forEach((url) => {
            const img = document.createElement('img');
            img.src = url;
          });
        }
      }, [imageUrls, preloadImage]);

      return customImageListComponent ? (
        React.cloneElement(customImageListComponent, { ref })
      ) : (
        <ul ref={ref} className={imageListClassname} style={{ ...style, ...disableShowStyle }}>
          {thumbnailsUrl && thumbnailsUrl.length > 0 && thumbnailsUrl.map((thumbnailUrl, index) => {
            let alt = '';
            if (Array.isArray(title)) {
              try {
                alt = title[index];
              } catch (error) {
                // get title error
                console.warn('title array size is not match image array size');
              }
            } else if (typeof title === 'string') {
              alt = title;
            }
            return (
              <li>
                <img
                  src={thumbnailUrl}
                  key={thumbnailUrl}
                  alt={alt}
                  data-src={imageUrls[index]}
                  loading={thumbnailLoadingType}
                />
              </li>
            );
          })}
        </ul>
      );
    });

ImageList.displayName = 'ImageList';

export default ImageList;
