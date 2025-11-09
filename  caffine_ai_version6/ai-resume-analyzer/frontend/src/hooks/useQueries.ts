import { useMutation } from '@tanstack/react-query';
import { useActor } from './useActor';

interface GetInsightsParams {
  resumeBytes: Uint8Array;
  jobLevel: string;
  jobDescription: string;
}

export function useGetInsights() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ resumeBytes, jobLevel, jobDescription }: GetInsightsParams) => {
      if (!actor) {
        throw new Error('Actor not initialized');
      }
      return actor.get_insights(resumeBytes, jobLevel, jobDescription);
    },
  });
}
