import * as React from 'react';

export interface CommonViewerJsProps {
  title?: string | string[] | boolean;
  showImageList?: boolean;
  imageUrls: string[];
  imageListClassname?: string;
  customImageListComponent?: React.ReactElement;
}
