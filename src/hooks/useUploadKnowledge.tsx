import { knowledgeApiData } from "@/services/knowledge";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useEffect } from "react";

const KnowledgeApis = new knowledgeApiData();

export interface UploadKnowledgeData {
    title: string,
    file_name: string,
    type: string,
    text: string,
    source_url: string,
    file: any,
}

export const useUploadKnowledgeMutation = () => {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    return useMutation({
        mutationFn: (data: UploadKnowledgeData) => {
            const formData = new FormData();
            formData.append("title", data?.title);
            formData.append("file_name", data?.file_name);
            formData.append("type", data?.type);
            formData.append("text", data?.text || "");
            formData.append("source_url", data?.source_url || "");
            if (data?.file) {
                formData.append("file", data?.file);
            }
            return KnowledgeApis.uploadKnowledge(formData as any);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['knowledges'] });
            enqueueSnackbar('Knowledge updated successfully!', { variant: 'success' });
        },
        onError: (error: Error) => {
            enqueueSnackbar(error.message || 'Failed to update knowledge', { variant: 'error' });
        },
    });
};

export const useGetKnowledgesQuery = () => {
    const { enqueueSnackbar } = useSnackbar();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['knowledges'],
        queryFn: () => KnowledgeApis.getAllKnowledges(),
        staleTime: 2 * 60 * 1000,
    });

    useEffect(() => {
        if (isError) {
            enqueueSnackbar(error instanceof Error ? error.message : 'Failed to load knowledge', { variant: 'error' });
        }
    }, [isError, error, enqueueSnackbar]);

    return { data, isLoading, isError };
};


export const useKnowledgeByIdQuery = (id: string) => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['knowledge', id],
        queryFn: () => KnowledgeApis.getKnowledgeById(id),
        enabled: !!id,
        staleTime: 3 * 60 * 1000,
    });
    return { data, isLoading, isError };
}

export const useUpdateKnowledgeMutation = () => {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => {
            const formData = new FormData();
            formData.append("title", data?.title);
            formData.append("text", data?.text ?? null);
            return KnowledgeApis.updateKnowledgeById(id, formData as any);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['knowledges'] });
            enqueueSnackbar('Knowledge updated successfully!', { variant: 'success' });
        },
        onError: (error: Error) => {
            enqueueSnackbar(error.message || 'Failed to update knowledge', { variant: 'error' });
        },
    });
};

export const useDeleteKnowledgeById = () => {
    const { enqueueSnackbar } = useSnackbar();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => KnowledgeApis.deleteKnowledgeById(id),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["knowledges"] });
            enqueueSnackbar("Knowledge deleted successfully", {
                variant: "success",
            });
        },

        onError: (error: any) => {
            enqueueSnackbar(
                error?.message || "Failed to delete knowledge",
                { variant: "error" }
            );
        },
    });
};