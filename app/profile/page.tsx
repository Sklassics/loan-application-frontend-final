"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  AlertCircle,
  Camera,
  Edit,
  Save,
  Trash,
  Bell,
  Globe,
  User,
  Lock,
  Settings,
  Mail,
  Smartphone,
  IndianRupee,
  Clock,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { motion } from "framer-motion"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")

  const handleSaveProfile = () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      setIsEditing(false)
    }, 1500)
  }

  const handleDeleteAccount = () => {
    // Simulate API call
    setTimeout(() => {
      setShowDeleteDialog(false)
      window.location.href = "/"
    }, 1500)
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 70 } },
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Profile" text="Manage your personal information and account settings.">
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-violet-150 transition-all duration-300"
          >
            <Edit className="mr-2 h-4 w-4" /> Edit Profile
          </Button>
        ) : (
          <Button
            onClick={handleSaveProfile}
            disabled={isSaving}
            className="bg-violet-150 transition-all duration-300"
          >
            {isSaving ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </>
            )}
          </Button>
        )}
      </DashboardHeader>

      <Tabs defaultValue="personal" className="space-y-4" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-100/80 backdrop-blur-sm">
          <TabsTrigger
            value="personal"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
          >
            <User className="h-4 w-4 mr-2" />
            Personal Information
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
          >
            <Lock className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger
            value="preferences"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
          >
            <Settings className="h-4 w-4 mr-2" />
            Preferences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
            <motion.div variants={item}>
              <Card className="border-slate-200 hover:shadow-md transition-shadow duration-300 overflow-hidden">
                <div className="hidden md:absolute h-1 w-full top-0 bg-gradient-to-r from-violet-500 to-indigo-500"></div>
                <CardHeader className="relative">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar className="h-20 w-20 border-4 border-white shadow-md">
                        <AvatarImage src="/placeholder.svg?text=JD" alt="Profile" />
                        <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
                          JD
                        </AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <div className="absolute -right-1 -bottom-1 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 p-1 text-white shadow-sm">
                          <label htmlFor="avatar-upload" className="cursor-pointer">
                            <Camera className="h-4 w-4" />
                            <span className="sr-only">Upload avatar</span>
                            <input id="avatar-upload" type="file" className="hidden" accept="image/*" />
                          </label>
                        </div>
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-slate-800">John Doe</CardTitle>
                      <CardDescription className="text-slate-500">john.doe@example.com</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="first-name" className="text-slate-700">
                        First Name
                      </Label>
                      <Input
                        id="first-name"
                        defaultValue="John"
                        disabled={!isEditing}
                        className="border-slate-300 focus:border-violet-500 focus:ring-violet-500/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name" className="text-slate-700">
                        Last Name
                      </Label>
                      <Input
                        id="last-name"
                        defaultValue="Doe"
                        disabled={!isEditing}
                        className="border-slate-300 focus:border-violet-500 focus:ring-violet-500/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-700">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        defaultValue="john.doe@example.com"
                        disabled={!isEditing}
                        className="border-slate-300 focus:border-violet-500 focus:ring-violet-500/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-slate-700">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        defaultValue="+91 9876543210"
                        disabled={!isEditing}
                        className="border-slate-300 focus:border-violet-500 focus:ring-violet-500/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dob" className="text-slate-700">
                        Date of Birth
                      </Label>
                      <Input
                        id="dob"
                        type="date"
                        defaultValue="1990-01-01"
                        disabled={!isEditing}
                        className="border-slate-300 focus:border-violet-500 focus:ring-violet-500/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender" className="text-slate-700">
                        Gender
                      </Label>
                      <select
                        id="gender"
                        className="w-full rounded-md border border-slate-300 bg-background px-3 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-colors"
                        disabled={!isEditing}
                        defaultValue="male"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-slate-700">
                      Address
                    </Label>
                    <textarea
                      id="address"
                      className="w-full rounded-md border border-slate-300 bg-background px-3 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-colors"
                      rows={3}
                      defaultValue="123 Main Street, Apartment 4B, Mumbai, Maharashtra, 400001"
                      disabled={!isEditing}
                    ></textarea>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="border-slate-200 hover:shadow-md transition-shadow duration-300 overflow-hidden">
                <div className="absolute h-1 w-full top-0 bg-gradient-to-r from-indigo-500 to-blue-500"></div>
                <CardHeader>
                  <CardTitle className="text-slate-800">Employment Information</CardTitle>
                  <CardDescription className="text-slate-500">
                    Your employment details help us determine loan eligibility
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="employment-type" className="text-slate-700">
                        Employment Type
                      </Label>
                      <select
                        id="employment-type"
                        className="w-full rounded-md border border-slate-300 bg-background px-3 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-colors"
                        disabled={!isEditing}
                        defaultValue="salaried"
                      >
                        <option value="salaried">Salaried</option>
                        <option value="self-employed">Self-Employed</option>
                        <option value="business">Business Owner</option>
                        <option value="student">Student</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company-name" className="text-slate-700">
                        Company/Organization Name
                      </Label>
                      <Input
                        id="company-name"
                        defaultValue="Acme Corporation"
                        disabled={!isEditing}
                        className="border-slate-300 focus:border-violet-500 focus:ring-violet-500/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="designation" className="text-slate-700">
                        Designation
                      </Label>
                      <Input
                        id="designation"
                        defaultValue="Senior Software Engineer"
                        disabled={!isEditing}
                        className="border-slate-300 focus:border-violet-500 focus:ring-violet-500/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="monthly-income" className="text-slate-700">
                        Monthly Income (₹)
                      </Label>
                      <Input
                        id="monthly-income"
                        type="number"
                        defaultValue="50000"
                        disabled={!isEditing}
                        className="border-slate-300 focus:border-violet-500 focus:ring-violet-500/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="work-experience" className="text-slate-700">
                        Work Experience (years)
                      </Label>
                      <Input
                        id="work-experience"
                        type="number"
                        defaultValue="5"
                        disabled={!isEditing}
                        className="border-slate-300 focus:border-violet-500 focus:ring-violet-500/20"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="border-slate-200 hover:shadow-md transition-shadow duration-300 overflow-hidden">
                <div className="absolute h-1 w-full top-0 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                <CardHeader>
                  <CardTitle className="text-slate-800">Bank Details</CardTitle>
                  <CardDescription className="text-slate-500">
                    Your bank details for loan disbursement and EMI payments
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="account-holder" className="text-slate-700">
                        Account Holder Name
                      </Label>
                      <Input
                        id="account-holder"
                        defaultValue="John Doe"
                        disabled={!isEditing}
                        className="border-slate-300 focus:border-violet-500 focus:ring-violet-500/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="account-number" className="text-slate-700">
                        Account Number
                      </Label>
                      <Input
                        id="account-number"
                        defaultValue="XXXX XXXX XXXX 1234"
                        disabled={!isEditing}
                        className="border-slate-300 focus:border-violet-500 focus:ring-violet-500/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bank-name" className="text-slate-700">
                        Bank Name
                      </Label>
                      <Input
                        id="bank-name"
                        defaultValue="State Bank of India"
                        disabled={!isEditing}
                        className="border-slate-300 focus:border-violet-500 focus:ring-violet-500/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ifsc-code" className="text-slate-700">
                        IFSC Code
                      </Label>
                      <Input
                        id="ifsc-code"
                        defaultValue="SBIN0001234"
                        disabled={!isEditing}
                        className="border-slate-300 focus:border-violet-500 focus:ring-violet-500/20"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="border-red-200 hover:shadow-md transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-red-500">Danger Zone</CardTitle>
                  <CardDescription className="text-slate-500">
                    Actions in this section can permanently affect your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Warning</AlertTitle>
                    <AlertDescription>
                      Deleting your account is permanent and cannot be undone. All your data will be permanently
                      removed.
                    </AlertDescription>
                  </Alert>
                </CardContent>
                <CardFooter>
                  <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <DialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash className="mr-2 h-4 w-4" /> Delete Account
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently delete your account and remove all your
                          data from our servers.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="confirm-delete">Type "DELETE" to confirm</Label>
                          <Input
                            id="confirm-delete"
                            placeholder="DELETE"
                            className="border-slate-300 focus:border-red-500 focus:ring-red-500/20"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setShowDeleteDialog(false)}
                          className="border-slate-200 hover:border-slate-300"
                        >
                          Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteAccount}>
                          Delete Account
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
            <motion.div variants={item}>
              <Card className="border-slate-200 hover:shadow-md transition-shadow duration-300 overflow-hidden">
                <div className="hidden md:absolute h-1 w-full top-0 bg-gradient-to-r from-violet-500 to-indigo-500"></div>
                <CardHeader>
                  <CardTitle className="text-slate-800">Security Settings</CardTitle>
                  <CardDescription className="text-slate-500">
                    Manage your password and security preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password" className="text-slate-700">
                      Current Password
                    </Label>
                    <Input
                      id="current-password"
                      type="password"
                      className="border-slate-300 focus:border-violet-500 focus:ring-violet-500/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password" className="text-slate-700">
                      New Password
                    </Label>
                    <Input
                      id="new-password"
                      type="password"
                      className="border-slate-300 focus:border-violet-500 focus:ring-violet-500/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-slate-700">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      className="border-slate-300 focus:border-violet-500 focus:ring-violet-500/20"
                    />
                  </div>
                  <Button className="mt-2 bg-violet-150 transition-all duration-300">
                    Change Password
                  </Button>

                  <div className="mt-6 pt-6 border-t border-slate-200">
                    <h3 className="text-lg font-medium text-slate-800 mb-4">Two-Factor Authentication</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-700">Phone Number Verification</p>
                        <p className="text-sm text-slate-500">Verify your identity with OTP sent to your phone</p>
                      </div>
                      <Button
                        variant="outline"
                        className="border-violet-200 text-violet-700 bg-violet-150 transition-colors"
                      >
                        Enable
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="border-slate-200 hover:shadow-md transition-shadow duration-300 overflow-hidden">
                <div className="absolute h-1 w-full top-0 bg-gradient-to-r from-indigo-500 to-blue-500"></div>
                <CardHeader>
                  <CardTitle className="text-slate-800">Login History</CardTitle>
                  <CardDescription className="text-slate-500">Recent login activities on your account</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 rounded-md bg-violet-50">
                      <div>
                        <p className="font-medium text-slate-800">Mumbai, India</p>
                        <p className="text-sm text-slate-500">Today, 10:30 AM</p>
                      </div>
                      <span className="text-green-500 text-sm font-medium">Current Session</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-md hover:bg-slate-50 transition-colors">
                      <div>
                        <p className="font-medium text-slate-800">Mumbai, India</p>
                        <p className="text-sm text-slate-500">Yesterday, 6:45 PM</p>
                      </div>
                      <span className="text-sm text-slate-600">iPhone 13</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-md hover:bg-slate-50 transition-colors">
                      <div>
                        <p className="font-medium text-slate-800">Delhi, India</p>
                        <p className="text-sm text-slate-500">March 15, 2023, 2:15 PM</p>
                      </div>
                      <span className="text-sm text-slate-600">Windows PC</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full border-slate-200 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 transition-all duration-300"
                  >
                    View All Login Activities
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
            <motion.div variants={item}>
              <Card className="border-slate-200 hover:shadow-md transition-shadow duration-300 overflow-hidden">
                <div className="hidden md:absolute h-1 w-full top-0 bg-gradient-to-r from-violet-500 to-indigo-500"></div>
                <CardHeader>
                  <CardTitle className="text-slate-800">Notification Preferences</CardTitle>
                  <CardDescription className="text-slate-500">
                    Manage how and when you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    {[
                      {
                        title: "Email Notifications",
                        description: "Receive updates and alerts via email",
                        icon: Mail,
                        defaultChecked: true,
                      },
                      {
                        title: "SMS Notifications",
                        description: "Receive important alerts via SMS",
                        icon: Smartphone,
                        defaultChecked: true,
                      },
                      {
                        title: "Payment Reminders",
                        description: "Receive reminders before EMI due dates",
                        icon: Bell,
                        defaultChecked: true,
                      },
                      {
                        title: "Marketing Communications",
                        description: "Receive offers and promotional updates",
                        icon: Bell,
                        defaultChecked: false,
                      },
                    ].map((notification, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-md hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                            <notification.icon className="h-5 w-5 text-violet-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-800">{notification.title}</p>
                            <p className="text-sm text-slate-500">{notification.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`notification-${index}`}
                            className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500/20"
                            defaultChecked={notification.defaultChecked}
                          />
                          <label htmlFor={`notification-${index}`} className="text-sm text-slate-700">
                            Enable
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="border-slate-200 hover:shadow-md transition-shadow duration-300 overflow-hidden">
                <div className="absolute h-1 w-full top-0 bg-gradient-to-r from-indigo-500 to-blue-500"></div>
                <CardHeader>
                  <CardTitle className="text-slate-800">Language & Region</CardTitle>
                  <CardDescription className="text-slate-500">
                    Customize your language and regional preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="language" className="text-slate-700">
                      Language
                    </Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                      <select
                        id="language"
                        className="w-full rounded-md border border-slate-300 bg-background pl-10 px-3 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-colors"
                        defaultValue="en"
                      >
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                        <option value="ta">Tamil</option>
                        <option value="te">Telugu</option>
                        <option value="mr">Marathi</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency" className="text-slate-700">
                      Currency
                    </Label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                      <select
                        id="currency"
                        className="w-full rounded-md border border-slate-300 bg-background pl-10 px-3 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-colors"
                        defaultValue="inr"
                      >
                        <option value="inr">Indian Rupee (₹)</option>
                        <option value="usd">US Dollar ($)</option>
                        <option value="eur">Euro (€)</option>
                        <option value="gbp">British Pound (£)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone" className="text-slate-700">
                      Time Zone
                    </Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                      <select
                        id="timezone"
                        className="w-full rounded-md border border-slate-300 bg-background pl-10 px-3 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-colors"
                        defaultValue="asia-kolkata"
                      >
                        <option value="asia-kolkata">Asia/Kolkata (GMT+5:30)</option>
                        <option value="america-new_york">America/New_York (GMT-4:00)</option>
                        <option value="europe-london">Europe/London (GMT+1:00)</option>
                        <option value="asia-dubai">Asia/Dubai (GMT+4:00)</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="bg-violet-150 transition-all duration-300">
                    Save Preferences
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}

