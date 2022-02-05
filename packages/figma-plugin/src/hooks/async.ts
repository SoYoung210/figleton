import { useCallback, useState } from 'react';

type AsyncStatus = 'success' | 'failure' | 'pending' | 'waiting';

export default function useAsyncHandler<Params extends unknown[], Returns>(
  handler: (...params: Params) => Promise<Returns>
) {
  const [status, setStatus] = useState<AsyncStatus>('waiting');
  const isPending = status === 'pending';

  const enhancedHandler = useCallback(
    async (...params: Params) => {
      setStatus('pending');
      try {
        const result = await handler(...params);
        setStatus('success');
        return result;
      } catch {
        setStatus('failure');
      }
    },
    [handler]
  );

  return [
    enhancedHandler,
    {
      isPending,
      status,
      setStatus,
    },
  ] as const;
}
