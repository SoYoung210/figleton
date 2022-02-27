import React from 'react';
import { Skeleton, SkeletonProps } from '@figeleton/skeleton';
import JsxParser from 'react-jsx-parser';
import { SkeletonOption } from '../model';

interface Props {
  uiCode: string;
  options: SkeletonOption | undefined;
}

export default function ResultPreviewSection({ uiCode, options }: Props) {
  function StyledSkeleton({
    animation = options?.animation,
    startColor = options?.startColor,
    endColor = options?.endColor,
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

  return (
    <div style={{ position: 'relative' }}>
      <JsxParser components={{ StyledSkeleton }} jsx={uiCode} />
    </div>
  );
}
