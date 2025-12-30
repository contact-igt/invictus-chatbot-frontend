"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Link as LinkIcon, UploadCloud, Trash2, Globe, CheckCircle, Clock, Pencil, Eye, MoreHorizontal, File, DownloadIcon } from "lucide-react";
import { useSnackbar } from "notistack";
import { extractTextFromFile } from "../../../utils/ocr.js"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetKnowledgesQuery, useUploadKnowledgeMutation, useUpdateKnowledgeMutation, useDeleteKnowledgeById, useKnowledgeByIdQuery } from "@/hooks/useUploadKnowledge";

const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

const formatDisplayKnowledge = (type: string, data: any): string => {
    switch (type) {
        case "text":
            return data?.text
                ? data.text.length > 120
                    ? `${data.text.slice(0, 120)}...`
                    : data.text
                : "Text content";

        case "url":
            return data?.source_url || "Website URL";

        case "pdf":
            return data?.file_name || data?.file_url || "Uploaded file";

        default:
            return "knowledge source";
    }
};

export default function KnowledgeBasePage() {
    const { enqueueSnackbar } = useSnackbar();
    const fileRef = useRef<HTMLInputElement>(null);
    const [activeTab, setActiveTab] = useState("sources");
    const { data: knowledgeData, isLoading: isKnowledgeLoading, isError } = useGetKnowledgesQuery();
    const [isDragging, setIsDragging] = useState(false);
    const { mutate: uploadKnowledgeMutate, isPending } = useUploadKnowledgeMutation();
    const [uploadedData, setUploadedData] = useState<Array<{ name: string, size: string, date: string, type: string, fileObj?: File }>>([]);
    const [websiteUrl, setWebsiteUrl] = useState("");
    const [textContent, setTextContent] = useState("");
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [viewMode, setViewMode] = useState<'view' | 'edit'>('view');
    const [editContent, setEditContent] = useState("");
    const { data: knowledgeDetailsById, isLoading: isKnowledgeByIdLoading } = useKnowledgeByIdQuery(selectedItem?.id);

    const { mutate: updateKnowledgeMutate } = useUpdateKnowledgeMutation();
    console.log("knowledgeDetailsById", knowledgeDetailsById)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<any>(null);

    const { mutate: deleteKnowledgeMutate } = useDeleteKnowledgeById();

    const handleView = (item: any) => {
        setSelectedItem(item);
        setViewMode('view');
        setIsViewModalOpen(true);
    };

    const handleEdit = (item: any) => {
        setSelectedItem(item);
        setViewMode('edit');
        setIsViewModalOpen(true);
    };

    const handleUpdateKnowledge = () => {
        if (!selectedItem) return;
        const payload: {
            title: string;
            text?: string;
        } = {
            title: "Ophthall conclave conference",
            text: editContent
        }
        updateKnowledgeMutate({
            id: selectedItem.id,
            data: payload
        });
        setIsViewModalOpen(false);
    };

    const handleDeleteClick = (item: any) => {
        setItemToDelete(item);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (itemToDelete) {
            deleteKnowledgeMutate(itemToDelete.id);
            setIsDeleteModalOpen(false);
            setItemToDelete(null);
        }
    };
    console.log("knowledgeData", knowledgeData)
    const processFiles = async(files: FileList | null) => {
        const MAX_FILE_SIZE_MB = 2;
        const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
        if (!files || files.length === 0) return;
        const allowedTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "text/plain",
        ];

        const validFiles: File[] = [];

        Array.from(files).forEach((file) => {
            if (!allowedTypes.includes(file.type)) {
                enqueueSnackbar(`File not allowed`, { variant: "error" });
                return;
            }
            if (file.size > MAX_FILE_SIZE_BYTES) {
                enqueueSnackbar(`File too large`, { variant: "error" });
                return;
            }
            validFiles.push(file);
        });

        if (validFiles.length === 0) return;
        console.log("validFiles", validFiles)
        // Add files to uploaded files list
        const newFiles = await  Promise.all(validFiles.map(async(file) => {
            const text = await extractTextFromFile(file);
            console.log("text", text)
            return {
                name: file?.name,
                size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
                date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                type: file.type.includes("pdf") ? "pdf" : file.type.includes("word") ? "doc" : "txt",
                fileObj: file,
                text
            }
        }));

        setUploadedData(prev => [...newFiles, ...prev]);
    };

    const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        processFiles(e.target.files);
        e.target.value = "";
    };

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
        processFiles(e.dataTransfer.files);
    };

    const handleUploadKnowledge = async (type: 'file' | 'text' | 'url') => {
        const title = "Ophthall conclave conference";
        console.log("uploadedData", uploadedData)
        if (type === 'file') {
            if (uploadedData.length === 0) {
                return;
            }
            uploadKnowledgeMutate({
                title: title,
                file_name: title
                // file_name: uploadedData ? uploadedData[0]?.name?.replace(/\.[^/.]+$/, "")
                // ?.replace(/\s*\(\d+\)$/, "")
                ,
                // type: uploadedData[0]?.type,
                type: "file",
                text: 'Ophthall 2026, the 8th edition of India’s exclusive Practice Development Conclave, will be held from January 9–12, 2026 at the CIDCO Exhibition & Convention Centre, Navi Mumbai.',
                source_url: '',
                file: ""
                // file: uploadedData[0]?.fileObj
            }, {
                onSuccess: () => {
                    setUploadedData([]);
                }
            });

        } else if (type === 'text') {
            if (!textContent.trim()) {
                return;
            }
            uploadKnowledgeMutate({
                title: title,
                file_name: title,
                type: 'text',
                text: textContent.trim(),
                source_url: '',
                file: ''
            });
            setTextContent('');
        } else if (type === 'url') {
            if (!websiteUrl.trim()) {
                return;
            }
            try {
                new URL(websiteUrl);
            } catch (e) {
                enqueueSnackbar("Please enter a valid URL", { variant: "error" })
                return;
            }
            uploadKnowledgeMutate({
                title: title,
                file_name: title,
                type: 'url',
                text: '',
                source_url: websiteUrl.trim(),
                file: ''
            });
            setWebsiteUrl('');
        }
    };

    useEffect(() => {
        if (viewMode === "edit" && knowledgeDetailsById) {
            const data = knowledgeDetailsById.data || knowledgeDetailsById;
            const content = data?.raw_text;
            setEditContent(content);
        }
    }, [knowledgeDetailsById, viewMode]);
    console.log("editContent", editContent)
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Knowledge Base</h1>
                <p className="text-base text-slate-500 dark:text-slate-400 mt-1">Train your AI assistant with your hospital's documents and website data.</p>
            </div>

            <Tabs defaultValue="sources" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-[400px] bg-slate-100 dark:bg-slate-800">
                    <TabsTrigger value="sources">Data Sources</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="sources" className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card
                            className={`relative border-2 transition-all duration-300 overflow-hidden ${isDragging
                                ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-950/30 shadow-lg scale-[1.02]'
                                : 'border-dashed border-slate-300 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900 dark:to-blue-950/20 hover:border-blue-400 hover:shadow-md'
                                }`}
                            onDragEnter={handleDragEnter}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            {/* Animated background gradient on drag */}
                            {isDragging && (
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 opacity-50 animate-pulse" />
                            )}

                            <CardContent className="relative flex flex-col items-center justify-center py-12 text-center cursor-pointer">
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${isDragging
                                    ? 'bg-blue-500 text-white scale-110 shadow-lg'
                                    : 'bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600'
                                    }`}>
                                    <UploadCloud className={`transition-all duration-300 ${isDragging ? 'w-8 h-8' : 'w-7 h-7'}`} />
                                </div>

                                <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">
                                    {isDragging ? 'Drop files here' : 'Upload Documents'}
                                </h3>

                                <p className="text-base text-slate-600 dark:text-slate-400 max-w-xs mb-6 leading-relaxed">
                                    {isDragging
                                        ? 'Release to upload your files'
                                        : 'Drag & drop your files here or click below to browse'
                                    }
                                </p>

                                {!isDragging && (
                                    <>
                                        <Input
                                            ref={fileRef}
                                            id="file-upload"
                                            type="file"
                                            multiple
                                            accept=".pdf,.doc,.docx,.txt"
                                            onChange={handleUploadFile}
                                            className="hidden"
                                        />

                                        <Button
                                            variant="default"
                                            size="lg"
                                            onClick={() => fileRef.current?.click()}
                                            disabled={isPending}
                                        >
                                            <UploadCloud className="w-4 h-4 mr-2" />
                                            <span className="text-base">Click here to select files</span>
                                        </Button>

                                        <p className="text-xs text-slate-400 mt-4">
                                            Supported formats: PDF, DOCX, DOC, TXT
                                        </p>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* Right Column - Uploaded Files List */}
                        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 lg:col-span-2 flex flex-col">
                            <CardHeader>
                                <CardTitle className="text-xl text-slate-900 dark:text-slate-100">Uploaded Files</CardTitle>
                                <CardDescription className="text-base text-slate-500 dark:text-slate-400">Recently uploaded documents</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col flex-1">
                                <div className="flex-1">
                                    {uploadedData.length === 0 ? (
                                        <div className="text-center py-12 text-slate-400">
                                            <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                            <p className="text-base">No files uploaded yet</p>
                                            <p className="text-sm mt-1">Upload documents to see them here</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3 max-h-[300px] overflow-y-auto">
                                            {uploadedData.map((file, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${file.type === 'pdf' ? 'bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400' :
                                                            file.type === 'doc' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400' :
                                                                'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                                                            }`}>
                                                            <FileText className="w-5 h-5" />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="font-medium text-sm text-slate-900 dark:text-slate-100 truncate">{file.name}</p>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400">{file.size} • {file.date}</p>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-slate-400 hover:text-red-500 flex-shrink-0"
                                                        onClick={() => setUploadedData(prev => prev.filter((_, i) => i !== index))}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700 mt-4">
                                    <Button
                                        onClick={() => {
                                            if (uploadedData.length > 0) {
                                                handleUploadKnowledge('file');
                                            }
                                        }}
                                        disabled={uploadedData.length === 0 || isPending}
                                    >
                                        {isPending ? "Uploading..." : "Upload Document"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-xl text-slate-900 dark:text-slate-100">Add Website URL</CardTitle>
                                <CardDescription className="text-base text-slate-500 dark:text-slate-400">Crawl your website for information.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Globe className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                        <Input
                                            placeholder="https://cityhospital.com/services"
                                            className="pl-9"
                                            value={websiteUrl}
                                            onChange={(e) => setWebsiteUrl(e.target.value)}
                                        />
                                    </div>
                                    <Button onClick={() => {
                                        if (websiteUrl.trim()) {
                                            handleUploadKnowledge('url');
                                        }
                                    }} disabled={!websiteUrl.trim()}>Add</Button>
                                </div>
                                <p className="text-xs text-slate-400 mt-2">
                                    The AI will automatically re-crawl this link every 24 hours.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 lg:col-span-2">
                            <CardHeader>
                                <CardTitle className="text-xl text-slate-900 dark:text-slate-100">Add Text Content</CardTitle>
                                <CardDescription className="text-base text-slate-500 dark:text-slate-400">Directly add text information for training.</CardDescription>
                            </CardHeader>
                            <CardContent>                                <Textarea
                                placeholder="Enter text content here... (e.g., FAQs, policies, procedures)"
                                className="min-h-[150px] text-base"
                                value={textContent}
                                onChange={(e) => setTextContent(e.target.value)}
                            />
                                <div className="flex items-center justify-between mt-3">
                                    <p className="text-xs text-slate-400">
                                        {textContent.length} characters
                                    </p>
                                    <Button
                                        onClick={() => {
                                            if (textContent.trim()) {
                                                handleUploadKnowledge('text');

                                            }
                                        }}
                                        disabled={!textContent.trim()}
                                    >
                                        Add Content
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Active Sources List */}
                    <Card className="border-slate-200 dark:border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-xl">Active Sources</CardTitle>
                            <CardDescription className="text-base">Content currently finding the AI's responses.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {knowledgeData?.data?.map((item: any, i: number) => {
                                    let icon = <FileText className="w-5 h-5" />;
                                    let style = "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300";

                                    if (item.type === 'url') {
                                        icon = <LinkIcon className="w-5 h-5" />;
                                        style = "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400";
                                    } else if (item.type === 'text') {
                                        icon = <FileText className="w-5 h-5" />;
                                        style = "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300";
                                    } else if (item.type === 'pdf') {
                                        icon = <File className="w-5 h-5" />;
                                        style = "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400";
                                    } else if (item.type === 'doc' || item.type === "docx") {
                                        icon = <FileText className="w-5 h-5" />;
                                        style = "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400";
                                    }

                                    return (
                                        <div key={i} className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm transition-all duration-200">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-11 h-11 rounded-lg flex items-center justify-center shadow-sm ${style}`}>
                                                    {icon}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-base text-slate-900 dark:text-slate-100">
                                                        {formatDisplayKnowledge(item?.type, item)}
                                                    </p>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400"> {formatDate(item?.created_at)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="flex items-center gap-1.5 text-xs font-semibold text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-3 py-1.5 rounded-full border border-green-200 dark:border-green-800">
                                                        <CheckCircle className="w-3.5 h-3.5" /> Trained
                                                    </span>
                                                    {/* <span className="flex items-center gap-1.5 text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                                                        <Clock className="w-3.5 h-3.5" /> Processing
                                                     </span> */}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-700">
                                                                <span className="sr-only">Open menu</span>
                                                                <MoreHorizontal className="w-4 h-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            {item?.type == "text" &&
                                                                <> <DropdownMenuItem onClick={() => handleView(item)}>
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    View
                                                                </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => handleEdit(item)}>
                                                                        <Pencil className="mr-2 h-4 w-4" />
                                                                        Edit
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuSeparator /></>}
                                                            {(item?.type == "pdf" || item?.type == "doc") && item?.file_url && (<>
                                                                <DropdownMenuItem asChild>
                                                                    <a href={item?.file_url} download={item?.file_name || "file"} >
                                                                        <DownloadIcon className="mr-2 h-4 w-4" />
                                                                        Download
                                                                    </a>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                            </>
                                                            )}
                                                            {item?.type == "url" && <>
                                                                <DropdownMenuItem onClick={() => {
                                                                    if (item?.source_url) {
                                                                        window.open(item?.source_url, "_blank", "noopener, noreferrer"
                                                                        )
                                                                    }
                                                                }}>
                                                                    <LinkIcon className="mr-2 h-4 w-4" />
                                                                    Visit
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator /></>
                                                            }
                                                            <DropdownMenuItem
                                                                onClick={() => handleDeleteClick(item)}
                                                                className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Remove
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="settings">
                    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                        <CardContent className="p-8 text-center text-slate-500 dark:text-slate-400">
                            Advanced configuration for chunking and vector database connections would go here.
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>


            <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{viewMode === 'view' ? 'View Knowledge' : 'Edit Knowledge'}</DialogTitle>
                        <DialogDescription>
                            {viewMode === 'view' ? 'View the details of your knowledge source.' : 'Make changes to your knowledge source.'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        {viewMode === "edit" && isKnowledgeByIdLoading ? (
                            <div className="text-center py-10 text-slate-500">
                                Loading content...
                            </div>
                        ) : viewMode === "view" ? (
                            <div className="p-4 bg-slate-50 rounded-md whitespace-pre-wrap max-h-[400px] overflow-y-auto text-sm border">
                                {(() => {
                                    const data = knowledgeDetailsById?.data || knowledgeDetailsById;
                                    return data?.raw_text || ""
                                })()}
                            </div>
                        ) : (
                            <Textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="min-h-[300px] font-mono text-sm"
                            />
                        )}
                    </div>

                    <DialogFooter>
                        {viewMode === 'edit' ? (
                            <>
                                <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>Cancel</Button>
                                <Button onClick={handleUpdateKnowledge}>Save Changes</Button>
                            </>
                        ) : (
                            <Button onClick={() => setIsViewModalOpen(false)}>Close</Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>


            {/* Delete Confirmation Dialog */}
            < Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen} >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Knowledge Source?</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this item? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleConfirmDelete}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog >
        </div >
    );
}