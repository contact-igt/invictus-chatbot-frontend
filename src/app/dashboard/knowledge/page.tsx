"use client";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Link as LinkIcon, UploadCloud, Trash2, Globe, CheckCircle, Clock } from "lucide-react";
import { useUploadFilesMutation } from "@/hooks/useUploadFiles";

export default function KnowledgeBasePage() {
    const fileRef = useRef<HTMLInputElement>(null);
    const [activeTab, setActiveTab] = useState("sources");
    const [isDragging, setIsDragging] = useState(false);
    const { mutate: uploadFileMutate, isPending } = useUploadFilesMutation();

    const processFiles = (files: FileList | null) => {
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
                alert(`File not allowed: ${file.name}`);
                return;
            }

            validFiles.push(file);
        });

        if (validFiles.length === 0) return;

        uploadFileMutate(validFiles);
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

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Knowledge Base</h1>
                <p className="text-slate-500">Train your AI assistant with your hospital's documents and website data.</p>
            </div>

            <Tabs defaultValue="sources" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                    <TabsTrigger value="sources">Data Sources</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="sources" className="space-y-6 mt-6">
                    {/* Add New Source Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card
                            className={`relative border-2 transition-all duration-300 overflow-hidden ${isDragging
                                ? 'border-blue-500 bg-blue-50/80 shadow-lg scale-[1.02]'
                                : 'border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-blue-50/30 hover:border-blue-400 hover:shadow-md'
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

                                <h3 className="font-bold text-xl text-slate-900 mb-2">
                                    {isDragging ? 'Drop files here' : 'Upload Documents'}
                                </h3>

                                <p className="text-sm text-slate-600 max-w-xs mb-6 leading-relaxed">
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
                                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-300"
                                            onClick={() => fileRef.current?.click()}
                                            disabled={isPending}
                                        >
                                            <UploadCloud className="w-4 h-4 mr-2" />
                                            <span>{isPending ? 'Uploading...' : 'Click here to select files'}</span>
                                        </Button>

                                        <p className="text-xs text-slate-400 mt-4">
                                            Supported formats: PDF, DOCX, DOC, TXT
                                        </p>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="bg-white">
                            <CardHeader>
                                <CardTitle className="text-lg">Add Website URL</CardTitle>
                                <CardDescription>Crawl your website for information.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Globe className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                        <Input placeholder="https://cityhospital.com/services" className="pl-9" />
                                    </div>
                                    <Button>Add</Button>
                                </div>
                                <p className="text-xs text-slate-400 mt-2">
                                    The AI will automatically re-crawl this link every 24 hours.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Active Sources List */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Active Sources</CardTitle>
                            <CardDescription>Content currently finding the AI's responses.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[
                                    { type: "file", name: "Hospital_Policies_2024.pdf", size: "2.4 MB", status: "Trained", date: "Oct 24, 2024" },
                                    { type: "file", name: "Dr_Smith_Bio.docx", size: "1.1 MB", status: "Processing", date: "Just now" },
                                    { type: "url", name: "https://cityhospital.com/pediatrics", size: "12 Pages", status: "Trained", date: "Oct 22, 2024" },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg bg-white hover:border-blue-200 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.type === 'file' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                                                {item.type === 'file' ? <FileText className="w-5 h-5" /> : <LinkIcon className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900">{item.name}</p>
                                                <p className="text-xs text-slate-500">{item.size} • {item.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                {item.status === 'Trained' ? (
                                                    <span className="flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                                                        <CheckCircle className="w-3.5 h-3.5" /> Trained
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1.5 text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                                                        <Clock className="w-3.5 h-3.5" /> Processing
                                                    </span>
                                                )}
                                            </div>
                                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="settings">
                    <Card>
                        <CardContent className="p-8 text-center text-slate-500">
                            Advanced configuration for chunking and vector database connections would go here.
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}