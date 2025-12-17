"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Link as LinkIcon, UploadCloud, Trash2, Globe, CheckCircle, Clock } from "lucide-react";

export default function KnowledgeBasePage() {
    const [activeTab, setActiveTab] = useState("sources");

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
                        <Card className="border-dashed border-2 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                            <CardContent className="flex flex-col items-center justify-center py-10 text-center cursor-pointer">
                                <div className="w-12 h-12 bg-blue-100 text-primary rounded-full flex items-center justify-center mb-4">
                                    <UploadCloud className="w-6 h-6" />
                                </div>
                                <h3 className="font-semibold text-lg text-slate-900">Upload Documents</h3>
                                <p className="text-sm text-slate-500 max-w-xs mt-1 mb-4">
                                    Drag & drop PDFs, DOCX, or TXT files here to train the AI on hospital policies.
                                </p>
                                <Button variant="outline" size="sm">Select Files</Button>
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
