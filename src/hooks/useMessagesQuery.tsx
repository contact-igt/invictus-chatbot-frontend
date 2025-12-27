import { AxiosError } from "axios";
import { useSnackbar } from "notistack";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MessagesApiData } from "@/services/messages";
import { Variable } from "lucide-react";

const MessagesApis = new MessagesApiData();

export const useGetAllChatsQuery = () => {
    const { enqueueSnackbar } = useSnackbar();

    const { data, isLoading, isError } = useQuery({
        queryKey: ['chats'],
        queryFn: () => MessagesApis.getAllChats(),
        staleTime: 2 * 60 * 1000,
    });

    if (isError) {
        enqueueSnackbar('Failed to load messages', { variant: 'error' });
    }

    return { data, isLoading, isError };
};

export const useMessagesByPhoneQuery = (phone_number: string) => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['messages', phone_number],
        queryFn: () => MessagesApis.getMessagesByPhone(phone_number),
        enabled: !!phone_number,
        staleTime: 3 * 60 * 1000,
    });

    return { data, isLoading, isError };
};

export const useAddMessageMutation = () => {
    const queryClient = useQueryClient();
    // const { enqueueSnackbar } = useSnackbar();

    return useMutation({
        mutationFn: (data: any) => {
            return MessagesApis.addMessage(data);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["messages", variables.phone],
            });
            // enqueueSnackbar('Message sent successfully!', { variant: 'success' });
        },
        onError: (error: Error) => {
            // enqueueSnackbar(error.message || 'Failed to send message', { variant: 'error' });
        },
    });
};

export const useUpdateSeenMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (phone_number: any) => {
            return MessagesApis.updateSeen(phone_number);
        },
        onSuccess: (_, phone) => {
            queryClient.invalidateQueries({
                queryKey: ["messages", phone],
            });
            queryClient.invalidateQueries({
                queryKey: ["chats"],
            });
        },
    })
}