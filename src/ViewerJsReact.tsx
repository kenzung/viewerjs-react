import React, {
  forwardRef, ReactElement, useEffect, useImperativeHandle, useRef,
} from 'react';
import ReactDOM from 'react-dom';
import Viewerjs from 'viewerjs';
import { useUnmount } from 'react-use';
import ImageList from './ImageList';
import { CommonViewerJsProps } from './types';
import { eventEmitter, eventType } from './event';

interface ViewerJsReactProps extends CommonViewerJsProps{
  customToolbar?: ReactElement;
  viewerjsOptions?: Viewer.Options;
  onInit?: () => void;
  onReady?: () => void;
  onShown?: () => void;
  onViewed?: () => void;
  onBeforeClose?: () => void;
  onAfterClose?: () => void;
}

export const ViewerJsReact = forwardRef<
{ getViewer:() => Viewerjs | undefined }, ViewerJsReactProps
>(({
    customImageListComponent,
    customToolbar,
    imageUrls = [],
    showImageList,
    imageListClassname,
    viewerjsOptions = {},
    onInit,
    onReady,
    onShown,
    onViewed,
    onBeforeClose,
    onAfterClose,
  }, ref) => {
    const viewer = useRef<Viewerjs>();

    const currentImageDetail = useRef();

    const imageListRef = useRef<{
      getInnerRef:() => HTMLUListElement | null, getMountState:() => boolean
    }>({ getInnerRef: () => null, getMountState: () => false });

    const renderCustomToolbar = useRef<boolean>(false);

    useEffect(() => {
      const flag = imageUrls.some((url) => !!url);
      if (imageListRef.current.getMountState() && flag) {
        const innerRef = imageListRef.current.getInnerRef();
        if (innerRef) {
          if (onBeforeClose) {
            innerRef.addEventListener('hide', () => {
              onBeforeClose();
            });
          }
          if (onAfterClose) {
            innerRef.addEventListener('hidden', () => {
              onAfterClose();
            });
          }
          innerRef.addEventListener('view', (event: any) => {
            if (event && event.detail) {
              currentImageDetail.current = event.detail;
            }
          });
          viewer.current = new Viewerjs(innerRef, {
            toolbar: !customToolbar,
            ...viewerjsOptions,
            ready() {
              eventEmitter.emit(eventType.ready);
              if (onReady) {
                onReady();
              }
            },
            shown() {
              if (onShown) {
                onShown();
              }
            },
            viewed() {
              if (onViewed) {
                onViewed();
              }
            },
          });
          if (onInit) {
            onInit();
          }
        }
      }
      return () => {
        if (viewer.current) {
          viewer.current.destroy();
          renderCustomToolbar.current = false;
        }
      };
    }, [
      customToolbar,
      imageUrls,
      onAfterClose,
      onBeforeClose,
      onInit,
      onReady,
      onShown,
      onViewed,
      viewerjsOptions,
    ]);

    useEffect(() => {
      eventEmitter.addListener(eventType.ready, () => {
        if (customToolbar && !renderCustomToolbar.current && viewer.current) {
          const viewContainer = document.querySelector('.viewer-container');
          if (viewContainer) {
            const divContainer = document.createElement('div');
            ReactDOM.render(customToolbar, viewContainer.appendChild(divContainer));
            renderCustomToolbar.current = true;
          }
        }
      });
    }, [customToolbar]);

    useImperativeHandle(ref, () => ({
      getViewer: () => viewer.current,
      getCurrentImageDetail: () => currentImageDetail.current,
    }));

    useUnmount(() => {
      if (viewer.current) {
        viewer.current.destroy();
        eventEmitter.removeAllListeners();
      }
    });

    return (
      <ImageList
        ref={imageListRef}
        imageUrls={imageUrls}
        showImageList={!!showImageList}
        imageListClassname={imageListClassname}
        customImageListComponent={customImageListComponent}
      />
    );
  });

export default ViewerJsReact;
