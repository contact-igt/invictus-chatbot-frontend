import { UploadFilesApiData } from "@/services/uploadFiles";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";

const UploadFileApis = new UploadFilesApiData();

export const useUploadFilesMutation = () => {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    return useMutation({
        mutationFn: (data: any) => {
            return UploadFileApis.uploadFiles(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['upload-file'] });
            enqueueSnackbar('File uploaded successfully!', { variant: 'success' });
        },
        onError: (error: Error) => {
            enqueueSnackbar(error.message || 'Failed to upload files', { variant: 'error' });
        },
    });
};