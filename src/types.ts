import { ReactElement } from 'react';

export interface CommonViewerJsProps {
  showImageList?: boolean;
  imageUrls: string[];
  imageListClassname?: string;
  customImageListComponent?: ReactElement;
}
