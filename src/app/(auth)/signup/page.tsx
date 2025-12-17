import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"

export default function SignupPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Sign Up</CardTitle>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Input id="name" placeholder="Full Name" />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Input id="email" placeholder="Email" />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Input id="password" type="password" placeholder="Password" />
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Link href="/dashboard" className="w-full">
                        <Button className="w-full">Create Account</Button>
                    </Link>
                    <div className="text-sm text-slate-500 text-center">
                        Already have an account? <Link href="/login" className="text-primary hover:underline">Login</Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
