import { promptApiData } from "@/services/prompt";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useEffect } from "react";

const PromptApis = new promptApiData();

export const useCreatePromptMutation = () => {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    return useMutation({
        mutationFn: (data: any) => {
            return PromptApis.createPrompt(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['prompt-configurations'] });
            enqueueSnackbar('Prompt updated successfully!', { variant: 'success' });
        },
        onError: (error: Error) => {
            enqueueSnackbar(error.message || 'Failed to update prompt', { variant: 'error' });
        },
    });
};

export const useActivatePromptMutation = () => {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    return useMutation({
        mutationFn: ({id, data}: {id: string, data: any}) => {
            return PromptApis.activatePromptById(id, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['prompt-configurations'] });
            enqueueSnackbar('Prompt status updated successfully!', { variant: 'success' });
        },
        onError: (error: Error) => {
            enqueueSnackbar(error.message || 'Failed to update prompt status', { variant: 'error' });
        },
    });
};

export const useDeletePromptMutation = () => {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    return useMutation({
        mutationFn: (id: string) => {
            return PromptApis.deletePromptById(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['prompt-configurations'] });
            enqueueSnackbar('Prompt deleted successfully!', { variant: 'success' });
        },
        onError: (error: Error) => {
            enqueueSnackbar(error.message || 'Failed to delete prompt', { variant: 'error' });
        },
    });
};


export const useGetPromptConfigurationQuery = () => {
    const { enqueueSnackbar } = useSnackbar();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['prompt-configurations'],
        queryFn: () => PromptApis.getAllPrompts(),
        staleTime: 2 * 60 * 1000,
    });

    useEffect(() => {
        if (isError) {
            enqueueSnackbar(error instanceof Error ? error.message : 'Failed to load prompt configurations', { variant: 'error' });
        }
    }, [isError, error, enqueueSnackbar]);

    return { data, isLoading, isError };
}

export const usePromptByIdQuery = (id: string, type: string) => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['prompt-configurations', id],
        queryFn: () => PromptApis.getPromptById(id),
        enabled: !!id && type == "prompt",
        staleTime: 3 * 60 * 1000,
    });
    return { data, isLoading, isError };
}


export const useUpdatePromptMutation = () => {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => {
            const formData = new FormData();
            formData.append("name", data?.name);
            formData.append("prompt", data?.prompt ?? null);
            return PromptApis.updatePromptById(id, formData as any);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['prompt-configurations'] });
            enqueueSnackbar('Prompt updated successfully!', { variant: 'success' });
        },
        onError: (error: Error) => {
            enqueueSnackbar(error.message || 'Failed to update knowledge', { variant: 'error' });
        },
    });
};