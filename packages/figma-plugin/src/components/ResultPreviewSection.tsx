import React from 'react';
import { Skeleton, SkeletonProps } from '@figeleton/skeleton';
import JsxParser from 'react-jsx-parser';

function StyledSkeleton({
  animation = 'wave',
  startColor = '#e3e3e3',
  endColor = '#dedede',
  style,
  ...props
}: SkeletonProps) {
  return (
    <Skeleton
      animation={animation}
      startColor={startColor}
      endColor={endColor}
      style={{
        position: 'absolute',
        ...style,
      }}
      {...props}
    />
  );
}

interface Props {
  uiCode: string;
}

export default function ResultPreviewSection({ uiCode }: Props) {
  return (
    <div style={{ position: 'relative' }}>
      <JsxParser components={{ StyledSkeleton }} jsx={uiCode} />
    </div>
  );
}
