"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { UploadCloud, FileText, Trash2, CheckCircle, File, LinkIcon, MoreHorizontal, Pencil, Eye, DownloadIcon } from "lucide-react";
import { useSnackbar } from "notistack";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCreatePromptMutation, useGetPromptConfigurationQuery, useActivatePromptMutation, useDeletePromptMutation } from "@/hooks/usePromptQuery";
import { extractTextFromFile } from "@/utils/ocr";

interface PromptConfigurationProps {
    handleEdit: any;
    handleDeleteClick: any;
}

interface PromptItem {
    id: string;
    aiName: string;
    type: 'text' | 'file';
    content: string; // text content or file name
    fileObj?: File;
    createdAt: Date;
}

export default function PromptConfiguration({ handleEdit, handleDeleteClick }: PromptConfigurationProps) {
    const { enqueueSnackbar } = useSnackbar();
    const fileRef = useRef<HTMLInputElement>(null);
    const [aiName, setAiName] = useState("");
    const [inputType, setInputType] = useState<'text' | 'file'>('text');
    const [promptText, setPromptText] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [promptsList, setPromptsList] = useState<PromptItem[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    // Hooks
    const { data: promptsData, isLoading: isPromptsLoading, isError } = useGetPromptConfigurationQuery();
    const { mutate: createPromptMutate, isPending: isCreatePromptPending } = useCreatePromptMutation();
    const { mutate: activatePromptMutate } = useActivatePromptMutation();
    const { mutate: deletePromptMutate } = useDeletePromptMutation();

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            validateAndSetFile(files[0]);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            validateAndSetFile(e.target.files[0]);
        }
    };

    const validateAndSetFile = async (file: File) => {
        const allowedTypes = ['text/plain', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.type)) {
            enqueueSnackbar("Invalid file type. Please upload TXT, PDF, or DOC/DOCX.", { variant: 'error' });
            return;
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            enqueueSnackbar("File size exceeds 5MB limit.", { variant: 'error' });
            return;
        }
        const text = await extractTextFromFile(file);
        const fileData = {
            name: file.name,
            type: file.type,
            size: file.size,
            text: text,
            file: file
        }
        setSelectedFile(fileData as any);
    };

    const handleAddPrompt = () => {
        if (!aiName.trim()) {
            enqueueSnackbar("Please enter an Name.", { variant: 'error' });
            return;
        }

        if (inputType === 'text' && !promptText.trim()) {
            enqueueSnackbar("Please enter prompt text.", { variant: 'error' });
            return;
        }
        else if (inputType === 'file' && !selectedFile) {
            enqueueSnackbar("Please select a file.", { variant: 'error' });
            return;
        }

        if (inputType === "text") {
            if (!promptText.trim()) {
                enqueueSnackbar("Please enter prompt text.", { variant: 'error' });
                return;
            }
            createPromptMutate({
                name: aiName.trim(),
                prompt: promptText.trim()
            }, {
                onSuccess: () => {
                    setAiName("");
                    setPromptText("");
                }
            });
        }
        else if (inputType === "file") {
            if (!selectedFile) {
                enqueueSnackbar("Please select a file.", { variant: 'error' });
                return;
            }
            createPromptMutate({
                name: aiName.trim(),
                prompt: selectedFile?.text
            }, {
                onSuccess: () => {
                    setAiName("");
                    setPromptText("");
                    setSelectedFile(null);
                    if (fileRef.current) fileRef.current.value = "";
                }
            });
        }
    };

    const handleDeletePrompt = (id: string) => {
        deletePromptMutate(id);
    };

    const handleToggleActive = (id: string, is_active_status: string) => {
        console.log("is_active_status", is_active_status)
        const data = {
            is_active: is_active_status == "true" ? "false" : "true"
        }
        console.log("data", data);
        console.log("id", id)
        activatePromptMutate(id, data as any);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left Column - Configuration Form */}
            <div className="lg:col-span-2 space-y-6">
                <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-xl text-slate-900 dark:text-slate-100">Add New Configuration</CardTitle>
                        <CardDescription className="text-base text-slate-500 dark:text-slate-400">
                            Configure AI persona and instructions.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">

                        <div className="space-y-2">
                            <Label htmlFor="ai-name">Name</Label>
                            <Input
                                id="ai-name"
                                placeholder="e.g. Receptionist Bot"
                                value={aiName}
                                onChange={(e) => setAiName(e.target.value)}
                            />
                        </div>

                        {/* Input Type Toggle */}
                        <div className="space-y-3">
                            <Label>Prompt Source</Label>
                            <div className="flex gap-4">
                                <Button
                                    type="button"
                                    variant={inputType === 'text' ? 'default' : 'outline'}
                                    onClick={() => setInputType('text')}
                                    className="flex-1"
                                >
                                    <FileText className="w-4 h-4 mr-2" />
                                    Text Input
                                </Button>
                                <Button
                                    type="button"
                                    variant={inputType === 'file' ? 'default' : 'outline'}
                                    onClick={() => setInputType('file')}
                                    className="flex-1"
                                >
                                    <UploadCloud className="w-4 h-4 mr-2" />
                                    Upload File
                                </Button>
                            </div>
                        </div>

                        {/* Conditional Input Area */}
                        {inputType === 'text' ? (
                            <div className="space-y-2">
                                <Label htmlFor="prompt-text">Prompt Instructions</Label>
                                <Textarea
                                    id="prompt-text"
                                    placeholder="Enter detailed instructions for the AI..."
                                    className="min-h-[200px]"
                                    value={promptText}
                                    onChange={(e) => setPromptText(e.target.value)}
                                />
                                <p className="text-xs text-slate-400 text-right">{promptText.length} characters</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Label>Upload Prompt File</Label>
                                <div
                                    className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 text-center cursor-pointer ${isDragging
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                        : 'border-slate-300 dark:border-slate-700 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                        }`}
                                    onDragEnter={handleDragEnter}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={() => fileRef.current?.click()}
                                >
                                    <input
                                        type="file"
                                        ref={fileRef}
                                        className="hidden"
                                        accept=".txt,.pdf,.doc,.docx"
                                        onChange={handleFileSelect}
                                    />

                                    {selectedFile ? (
                                        <div className="flex flex-col items-center">
                                            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2">
                                                <FileText className="w-6 h-6" />
                                            </div>
                                            <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate max-w-full px-2">
                                                {selectedFile.name}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                {(selectedFile.size / 1024).toFixed(1)} KB
                                            </p>
                                            <Button variant="ghost" size="sm" className="mt-2 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedFile(null);
                                                if (fileRef.current) fileRef.current.value = "";
                                            }}>
                                                Remove
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center text-slate-500 dark:text-slate-400">
                                            <UploadCloud className="w-10 h-10 mb-2 opacity-50" />
                                            <p className="text-sm font-medium">Click to upload or drag & drop</p>
                                            <p className="text-xs mt-1 opacity-70">TXT, PDF, DOC (Max 5MB)</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <Button className="w-full" onClick={handleAddPrompt} disabled={isCreatePromptPending}>
                            {isCreatePromptPending ? "Saving..." : "Save Configuration"}
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Right Column - Prompts List */}
            <div className="lg:col-span-3">
                <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 h-full flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-xl text-slate-900 dark:text-slate-100">Configured Prompts</CardTitle>
                        <CardDescription className="text-base text-slate-500 dark:text-slate-400">
                            Manage AI personalities and system prompts.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto max-h-[600px] p-0">
                        {isPromptsLoading ? (
                            <div className="flex flex-col items-center justify-center py-16 text-slate-500 h-full">
                                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
                                <p>Loading prompts...</p>
                            </div>
                        ) : promptsData?.data?.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-slate-500 h-full">
                                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                                    <FileText className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                                </div>
                                <p className="text-base font-medium text-slate-900 dark:text-slate-100">No prompts configured</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 text-center max-w-xs">
                                    Add a new AI configuration using the form on the left.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4 p-4">
                                {promptsData?.data?.map((prompt: any) => (
                                    <div key={prompt.id} className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm transition-all duration-200">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-11 h-11 rounded-lg flex items-center justify-center shadow-sm ${prompt.type === 'text'
                                                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                                                : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                                }`}>
                                                <FileText className="w-5 h-5" />
                                                {/* {prompt.type === 'text' ? <FileText className="w-5 h-5" /> : <LinkIcon className="w-5 h-5" />} */}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-semibold text-base text-slate-900 dark:text-slate-100">
                                                        {prompt.name}
                                                    </p>
                                                    {/* <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider border ${prompt.type === 'text' 
                                                        ? 'bg-purple-50 border-purple-200 text-purple-700' 
                                                        : 'bg-blue-50 border-blue-200 text-blue-700'
                                                    }`}>
                                                        {prompt.type}
                                                    </span> */}
                                                </div>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                     {formatDate(prompt.created_at)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    checked={Boolean(prompt.is_active)}
                                                    onCheckedChange={() => handleToggleActive(prompt.id, prompt.is_active)}
                                                    id={`active-mode-${prompt.id}`}
                                                />
                                                <Label htmlFor={`active-mode-${prompt.id}`} className="text-sm font-medium text-slate-600 dark:text-slate-300 cursor-pointer">
                                                    {prompt.is_active =="true" ? "Active" : "Inactive"}
                                                </Label>
                                            </div>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-700">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleEdit(prompt)}>
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => handleDeleteClick(prompt, "prompt")}
                                                        className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Remove
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}