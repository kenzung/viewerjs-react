import * as React from 'react';

export interface CommonViewerJsProps {
  title?: string | string[] | boolean;
  showImageList?: boolean;
  thumbnailsUrl?: string[];
  imageUrls: string[];
  imageListClassname?: string;
  customImageListComponent?: React.ReactElement;
  thumbnailLoadingType?: 'lazy' | 'eager';
  preloadImage?: boolean;
}
