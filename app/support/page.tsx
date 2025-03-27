"use client"

import Link from "next/link"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageCircle, Send, User } from "lucide-react"

export default function SupportPage() {

    const [message, setMessage] = useState("")
    const [subject, setSubject] = useState("")
    const [description, setDescription] = useState("")
    const [priority, setPriority] = useState("medium")
    const [isSubmitting, setIsSubmitting] = useState(false)
  
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        setAttachment(event.target.files[0])
      }
    }
  
    const handleSendMail = () => {
      if (!subject || !message) {
        alert("Please fill in the subject and message before sending.")
        return
      }
  
      setIsSubmitting(true)
  
      // Simulate API call
      setTimeout(() => {
        alert("Email sent successfully!")
        setIsSubmitting(false)
      }, 2000)
    }
  const [attachment, setAttachment] = useState<File | null>(null)
  
  const [chatMessages, setChatMessages] = useState([
    { sender: "system", message: "Welcome to LoanEase support! How can we help you today?", time: "10:30 AM" },
  ])
  
  const handleSendMessage = () => {
    if (!message.trim()) return

    // Add user message
    setChatMessages((prev) => [
      ...prev,
      { sender: "user", message, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
    ])

    setMessage("")

    // Simulate response after a delay
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "system",
          message:
            "Thank you for your message. Our support team will get back to you shortly. In the meantime, you can check our FAQ section for common questions.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ])
    }, 1000)
  }

  const handleSubmitTicket = () => {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      alert("Support ticket submitted successfully! Our team will get back to you within 24 hours.")
      setSubject("")
      setDescription("")
      setPriority("medium")
    }, 1500)
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Customer Support" text="Get help with your loan application or account issues." />

      <Tabs defaultValue="email" className="space-y-4">
        <TabsList>
          <TabsTrigger value="email">Email Support</TabsTrigger>
          <TabsTrigger value="faq">Quick Help</TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="space-y-4">
          <Card className="animate-fade-in-up">
            <CardHeader>
              <CardTitle>Email Support</CardTitle>
              <CardDescription>
                For support, please drop an email to <strong>info@sklassics.com</strong> with your issue details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 p-4 border rounded-md">
                <h3 className="text-lg font-semibold">Compose Your Email:</h3>
                <input
                  type="text"
                  placeholder="Subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
                <textarea
                  placeholder="Write your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  rows={5}
                />
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Attach an image of the issue (optional):</label>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="mt-2" />
                </div>
                <Button
                  onClick={handleSendMail}
                  className={`mt-4 px-4 py-2 rounded-md text-white ${
                    isSubmitting ? "bg-gray-400" : "bg-violet-150"
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Mail"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
    

        <TabsContent value="ticket" className="space-y-4">
          <Card className="animate-fade-in-up">
            <CardHeader>
              <CardTitle>Submit a Support Ticket</CardTitle>
              <CardDescription>Create a support ticket for non-urgent issues</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Brief description of your issue"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="loan-application">Loan Application</option>
                  <option value="repayment">Loan Repayment</option>
                  <option value="account">Account Issues</option>
                  <option value="documents">Document Verification</option>
                  <option value="technical">Technical Support</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <select
                  id="priority"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  required
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  rows={5}
                  placeholder="Please provide as much detail as possible about your issue"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>

              <div className="space-y-2">
                <Label htmlFor="attachment">Attachment </Label>
                <Input id="attachment" type="file" />
                <p className="text-xs text-muted-foreground">
                  You can attach screenshots or documents related to your issue (Max size: 5MB)
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSubmitTicket} disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Submitting..." : "Submit Ticket"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="faq" className="space-y-4">
          <Card className="animate-fade-in-up">
            <CardHeader>
              <CardTitle>Quick Help</CardTitle>
              <CardDescription>Find answers to common questions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium">How do I check my loan application status?</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    You can check your loan application status in the "Applications" tab on your dashboard. It will show
                    the current stage of your application and any pending actions required from your side.
                  </p>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="font-medium">I'm having trouble uploading documents. What should I do?</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Make sure your documents are in the supported formats (PDF, JPG, PNG) and under the size limit
                    (5MB). If you're still having issues, try using a different browser or device, or contact our
                    support team for assistance.
                  </p>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="font-medium">How do I change my  ed mobile number?</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    To change your registered mobile number, go to your Profile page, click on Edit Profile, update your
                    phone number, and verify it with an OTP sent to the new number.
                  </p>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="font-medium">What should I do if my loan application is rejected?</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    If your loan application is rejected, you'll receive a notification with the reason. You can address
                    the issues mentioned and reapply after 30 days. Common reasons include insufficient income, poor
                    credit score, or incomplete documentation.
                  </p>
                </div>
              </div>

              <div className="text-center mt-4">
                <Link href="/faq">
                  <Button variant="outline">View All FAQs</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}

