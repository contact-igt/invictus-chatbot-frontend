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
                <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
                <p className="text-slate-500">Manage all aspects of your Hospital Bot SaaS.</p>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 h-auto p-1">
                    <TabsTrigger value="profile" className="gap-2"><Building2 className="w-4 h-4" /> Profile</TabsTrigger>
                    <TabsTrigger value="whatsapp" className="gap-2"><Smartphone className="w-4 h-4" /> WhatsApp</TabsTrigger>
                    <TabsTrigger value="bot" className="gap-2"><Bot className="w-4 h-4" /> AI Bot</TabsTrigger>
                    <TabsTrigger value="doctors" className="gap-2"><UserCog className="w-4 h-4" /> Doctors</TabsTrigger>
                    <TabsTrigger value="hours" className="gap-2"><Clock className="w-4 h-4" /> Hours</TabsTrigger>
                    <TabsTrigger value="templates" className="gap-2"><MessageSquare className="w-4 h-4" /> Templates</TabsTrigger>
                    <TabsTrigger value="security" className="gap-2"><ShieldCheck className="w-4 h-4" /> Admin</TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle>Hospital Profile</CardTitle>
                            <CardDescription>General information about your medical institution.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Hospital Name</Label>
                                    <Input defaultValue="City General Hospital" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Website URL</Label>
                                    <Input defaultValue="https://cityhospital.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Contact Email</Label>
                                    <Input defaultValue="contact@cityhospital.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Primary Phone</Label>
                                    <Input defaultValue="+1 (555) 123-4567" />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label>Address</Label>
                                    <Textarea defaultValue="123 Medical Drive, Healthville, CA 90210" />
                                </div>
                            </div>
                            <Button><Save className="w-4 h-4 mr-2" /> Save Profile</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="whatsapp">
                    <Card>
                        <CardHeader>
                            <CardTitle>WhatsApp Configuration</CardTitle>
                            <CardDescription>Manage your connection to the WhatsApp Business API.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                        <Smartphone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-green-900">Connected</h3>
                                        <p className="text-sm text-green-700">+1 (555) 010-9988</p>
                                    </div>
                                </div>
                                <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">Disconnect</Button>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Business Display Name</Label>
                                    <Input defaultValue="City Hospital Assistant" />
                                </div>
                                <div className="space-y-2">
                                    <Label>WABA ID (WhatsApp Business Account ID)</Label>
                                    <Input defaultValue="1009238491823" readOnly className="bg-slate-50" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 3. AI Bot Settings */}
                <TabsContent value="bot">
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Bot Behavior</CardTitle>
                                <CardDescription>Configure how the AI interacts with patients.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Welcome Message</Label>
                                    <Textarea defaultValue="Hello! I am the City Hospital AI Assistant. How can I help you today?" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Fallback Message (Unknown Query)</Label>
                                    <Textarea defaultValue="I'm sorry, I didn't verify that. Could you please rephrase or call our support line?" />
                                </div>
                                <div className="flex items-center justify-between border p-3 rounded-md">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Human Handoff</Label>
                                        <p className="text-sm text-slate-500">Automatically transfer to agent if sentiment is negative.</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>AI Language Settings</CardTitle>
                                <CardDescription>Control language detection and responses.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <label className="text-base font-medium">Auto-Detect Language</label>
                                        <p className="text-sm text-slate-500">AI replies in the user's language.</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="space-y-2">
                                    <Label>Primary Language</Label>
                                    <Select defaultValue="en">
                                        <SelectTrigger>
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
                    <Card>
                        <CardHeader>
                            <CardTitle>Appointment Configuration</CardTitle>
                            <CardDescription>Rules for booking and doctor availability.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between border p-3 rounded-md">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Allow Auto-Booking</Label>
                                    <p className="text-sm text-slate-500">AI can confirm appointments without manual review.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Slot Duration (Minutes)</Label>
                                    <Input type="number" defaultValue="30" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Buffer Time (Minutes)</Label>
                                    <Input type="number" defaultValue="15" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Cancellation Policy</Label>
                                <Textarea defaultValue="Cancel at least 24 hours in advance to avoid a fee." />
                            </div>
                            <Button>Save Rules</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 5. Business Hours */}
                <TabsContent value="hours">
                    <Card>
                        <CardHeader>
                            <CardTitle>Operating Hours</CardTitle>
                            <CardDescription>Set when your clinic is open for appointments.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                                <div key={day} className="flex items-center gap-4">
                                    <div className="w-24 font-medium">{day}</div>
                                    <Input type="time" defaultValue="09:00" className="w-32" />
                                    <span>to</span>
                                    <Input type="time" defaultValue="17:00" className="w-32" />
                                    <Switch defaultChecked />
                                </div>
                            ))}
                            <div className="flex items-center gap-4 text-slate-400">
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
                    <Card>
                        <CardHeader>
                            <CardTitle>Message Templates</CardTitle>
                            <CardDescription>Pre-approved WhatsApp templates for notifications.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Appointment Confirmation</Label>
                                <div className="p-3 bg-slate-50 border rounded-md text-sm text-slate-700">
                                    Hello {"{{1}}"}, your appointment with {"{{2}}"} is confirmed for {"{{3}}"}. Please arrive 10 min early.
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" size="sm">Edit</Button>
                                    <Button variant="secondary" size="sm">Submit for Approval</Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Surgery Follow-up</Label>
                                <div className="p-3 bg-slate-50 border rounded-md text-sm text-slate-700">
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
                    <Card>
                        <CardHeader>
                            <CardTitle>Admin & Security</CardTitle>
                            <CardDescription>Manage access and account security.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Admin Email</Label>
                                <Input defaultValue="admin@cityhospital.com" />
                            </div>
                            <div className="space-y-2">
                                <Label>Change Password</Label>
                                <Input type="password" placeholder="New Password" />
                            </div>
                            <div className="space-y-2">
                                <Label>Confirm Password</Label>
                                <Input type="password" placeholder="Confirm New Password" />
                            </div>
                            <div className="pt-4">
                                <h3 className="font-medium mb-4">Two-Factor Authentication</h3>
                                <div className="flex items-center justify-between border p-3 rounded-md">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Enable 2FA</Label>
                                        <p className="text-sm text-slate-500">Secure your account with SMS codes.</p>
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
