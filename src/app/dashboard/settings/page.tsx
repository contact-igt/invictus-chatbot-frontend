"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Building2, Smartphone, Bot, UserCog, Clock, MessageSquare, ShieldCheck } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Settings</h1>
                <p className="text-slate-500 dark:text-slate-400">Manage all aspects of your Hospital Bot SaaS.</p>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 h-auto p-1.5 bg-slate-100 dark:bg-slate-800">
                    <TabsTrigger value="profile" className="gap-2"><Building2 className="w-4 h-4" /> Profile</TabsTrigger>
                    <TabsTrigger value="whatsapp" className="gap-2"><Smartphone className="w-4 h-4" /> WhatsApp</TabsTrigger>
                    <TabsTrigger value="bot" className="gap-2"><Bot className="w-4 h-4" /> AI Bot</TabsTrigger>
                    <TabsTrigger value="doctors" className="gap-2"><UserCog className="w-4 h-4" /> Doctors</TabsTrigger>
                    <TabsTrigger value="hours" className="gap-2"><Clock className="w-4 h-4" /> Hours</TabsTrigger>
                    <TabsTrigger value="templates" className="gap-2"><MessageSquare className="w-4 h-4" /> Templates</TabsTrigger>
                    <TabsTrigger value="security" className="gap-2"><ShieldCheck className="w-4 h-4" /> Admin</TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-slate-900 dark:text-slate-100">Hospital Profile</CardTitle>
                            <CardDescription className="text-slate-500 dark:text-slate-400">General information about your medical institution.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-slate-700 dark:text-slate-300">Hospital Name</Label>
                                    <Input defaultValue="City General Hospital" className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-700 dark:text-slate-300">Website URL</Label>
                                    <Input defaultValue="https://cityhospital.com" className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-700 dark:text-slate-300">Contact Email</Label>
                                    <Input defaultValue="contact@cityhospital.com" className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-700 dark:text-slate-300">Primary Phone</Label>
                                    <Input defaultValue="+1 (555) 123-4567" className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100" />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="text-slate-700 dark:text-slate-300">Address</Label>
                                    <Textarea defaultValue="123 Medical Drive, Healthville, CA 90210" className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100" />
                                </div>
                            </div>
                            <Button><Save className="w-4 h-4 mr-2" /> Save Profile</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="whatsapp">
                    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-slate-900 dark:text-slate-100">WhatsApp Configuration</CardTitle>
                            <CardDescription className="text-slate-500 dark:text-slate-400">Manage your connection to the WhatsApp Business API.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between p-4 border border-green-200 dark:border-green-900/30 rounded-lg bg-green-50 dark:bg-green-900/10">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                                        <Smartphone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-green-900 dark:text-green-100">Connected</h3>
                                        <p className="text-sm text-green-700 dark:text-green-300">+1 (555) 010-9988</p>
                                    </div>
                                </div>
                                <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-900/30 dark:hover:bg-red-950/30">Disconnect</Button>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-slate-700 dark:text-slate-300">Business Display Name</Label>
                                    <Input defaultValue="City Hospital Assistant" className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-700 dark:text-slate-300">WABA ID (WhatsApp Business Account ID)</Label>
                                    <Input defaultValue="1009238491823" readOnly className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 3. AI Bot Settings */}
                <TabsContent value="bot">
                    <div className="space-y-6">
                        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-slate-900 dark:text-slate-100">Bot Behavior</CardTitle>
                                <CardDescription className="text-slate-500 dark:text-slate-400">Configure how the AI interacts with patients.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-slate-700 dark:text-slate-300">Welcome Message</Label>
                                    <Textarea defaultValue="Hello! I am the City Hospital AI Assistant. How can I help you today?" className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-700 dark:text-slate-300">Fallback Message (Unknown Query)</Label>
                                    <Textarea defaultValue="I'm sorry, I didn't verify that. Could you please rephrase or call our support line?" className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100" />
                                </div>
                                <div className="flex items-center justify-between border border-slate-200 dark:border-slate-700 p-3 rounded-md bg-slate-50 dark:bg-slate-800/50">
                                    <div className="space-y-0.5">
                                        <Label className="text-base text-slate-900 dark:text-slate-100">Human Handoff</Label>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Automatically transfer to agent if sentiment is negative.</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-slate-900 dark:text-slate-100">AI Language Settings</CardTitle>
                                <CardDescription className="text-slate-500 dark:text-slate-400">Control language detection and responses.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex flex-row items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800/50">
                                    <div className="space-y-0.5">
                                        <label className="text-base font-medium text-slate-900 dark:text-slate-100">Auto-Detect Language</label>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">AI replies in the user's language.</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-700 dark:text-slate-300">Primary Language</Label>
                                    <Select defaultValue="en">
                                        <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100">
                                            <SelectValue placeholder="Select Language" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="en">English (Default)</SelectItem>
                                            <SelectItem value="es">Spanish</SelectItem>
                                            <SelectItem value="fr">French</SelectItem>
                                            <SelectItem value="hi">Hindi</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button>Save AI Preferences</Button>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* 4. Doctor & Appointment Settings */}
                <TabsContent value="doctors">
                    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-slate-900 dark:text-slate-100">Appointment Configuration</CardTitle>
                            <CardDescription className="text-slate-500 dark:text-slate-400">Rules for booking and doctor availability.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between border border-slate-200 dark:border-slate-700 p-3 rounded-md bg-slate-50 dark:bg-slate-800/50">
                                <div className="space-y-0.5">
                                    <Label className="text-base text-slate-900 dark:text-slate-100">Allow Auto-Booking</Label>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">AI can confirm appointments without manual review.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-slate-700 dark:text-slate-300">Slot Duration (Minutes)</Label>
                                    <Input type="number" defaultValue="30" className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-700 dark:text-slate-300">Buffer Time (Minutes)</Label>
                                    <Input type="number" defaultValue="15" className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-slate-700 dark:text-slate-300">Cancellation Policy</Label>
                                <Textarea defaultValue="Cancel at least 24 hours in advance to avoid a fee." className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100" />
                            </div>
                            <Button>Save Rules</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 5. Business Hours */}
                <TabsContent value="hours">
                    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-slate-900 dark:text-slate-100">Operating Hours</CardTitle>
                            <CardDescription className="text-slate-500 dark:text-slate-400">Set when your clinic is open for appointments.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                                <div key={day} className="flex items-center gap-4">
                                    <div className="w-24 font-medium text-slate-900 dark:text-slate-100">{day}</div>
                                    <Input type="time" defaultValue="09:00" className="w-32 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100" />
                                    <span className="text-slate-600 dark:text-slate-400">to</span>
                                    <Input type="time" defaultValue="17:00" className="w-32 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100" />
                                    <Switch defaultChecked />
                                </div>
                            ))}
                            <div className="flex items-center gap-4 text-slate-400 dark:text-slate-500">
                                <div className="w-24 font-medium">Saturday</div>
                                <div className="flex-1 text-sm italic">Closed</div>
                                <Switch />
                            </div>
                            <Button className="mt-4"><Save className="w-4 h-4 mr-2" /> Update Hours</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 6. Message Templates */}
                <TabsContent value="templates">
                    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-slate-900 dark:text-slate-100">Message Templates</CardTitle>
                            <CardDescription className="text-slate-500 dark:text-slate-400">Pre-approved WhatsApp templates for notifications.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-slate-700 dark:text-slate-300">Appointment Confirmation</Label>
                                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-md text-sm text-slate-700 dark:text-slate-300">
                                    Hello {"{{1}}"}, your appointment with {"{{2}}"} is confirmed for {"{{3}}"}. Please arrive 10 min early.
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" size="sm">Edit</Button>
                                    <Button variant="secondary" size="sm">Submit for Approval</Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-700 dark:text-slate-300">Surgery Follow-up</Label>
                                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-md text-sm text-slate-700 dark:text-slate-300">
                                    Hi {"{{1}}"}, this is an automated check-in after your surgery. Are you experiencing any pain? (Reply YES/NO)
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" size="sm">Edit</Button>
                                    <Button variant="secondary" size="sm">Submit for Approval</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 7. Admin & Security */}
                <TabsContent value="security">
                    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-slate-900 dark:text-slate-100">Admin & Security</CardTitle>
                            <CardDescription className="text-slate-500 dark:text-slate-400">Manage access and account security.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-slate-700 dark:text-slate-300">Admin Email</Label>
                                <Input defaultValue="admin@cityhospital.com" className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-700 dark:text-slate-300">Change Password</Label>
                                <Input type="password" placeholder="New Password" className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-700 dark:text-slate-300">Confirm Password</Label>
                                <Input type="password" placeholder="Confirm New Password" className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100" />
                            </div>
                            <div className="pt-4">
                                <h3 className="font-medium mb-4 text-slate-900 dark:text-slate-100">Two-Factor Authentication</h3>
                                <div className="flex items-center justify-between border border-slate-200 dark:border-slate-700 p-3 rounded-md bg-slate-50 dark:bg-slate-800/50">
                                    <div className="space-y-0.5">
                                        <Label className="text-base text-slate-900 dark:text-slate-100">Enable 2FA</Label>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Secure your account with SMS codes.</p>
                                    </div>
                                    <Switch />
                                </div>
                            </div>
                            <Button className="w-full mt-4" variant="default">Save Security Settings</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
