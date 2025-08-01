"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Check } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export default function DrumShowPage() {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    toast({
      title: "Request Submitted",
      description: "We'll contact you shortly to discuss your drum show request.",
    })

    // In a real app, you would submit to an API here
    setTimeout(() => {
      router.push("/")
    }, 2000)
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Book a Drum Show</h1>
          <p className="text-muted-foreground mb-8">
            Make your event unforgettable with a professional drum performance. Our talented drummers can provide
            entertainment for corporate events, weddings, birthday parties, and more.
          </p>

          <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden mb-8">
            <Image
              src="https://images.pexels.com/photos/995301/pexels-photo-995301.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Drummer performing at an event"
              fill
              className="object-cover"
            />
          </div>

          {/* Drum Show Gallery */}
          <div className="grid grid-cols-3 gap-2 mb-8">
            <div className="relative aspect-square rounded-md overflow-hidden">
              <Image
                src="https://images.pexels.com/photos/8412414/pexels-photo-8412414.jpeg?auto=compress&cs=tinysrgb&w=300"
                alt="Solo drummer performance"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-square rounded-md overflow-hidden">
              <Image
                src="https://images.pexels.com/photos/7095517/pexels-photo-7095517.jpeg?auto=compress&cs=tinysrgb&w=300"
                alt="Drum duo performance"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-square rounded-md overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1445985543470-41fba5c3144a?auto=compress&cs=tinysrgb&w=300"
                alt="Interactive drum circle"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-square rounded-md overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1445985543470-41fba5c3144a?auto=compress&cs=tinysrgb&w=300"
                alt="Corporate event drum show"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-square rounded-md overflow-hidden">
              <Image
                src="https://images.pexels.com/photos/5089118/pexels-photo-5089118.jpeg?auto=compress&cs=tinysrgb&w=300"
                alt="Wedding reception drum performance"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-square rounded-md overflow-hidden">
              <Image
                src="https://images.pexels.com/photos/5089152/pexels-photo-5089152.jpeg?auto=compress&cs=tinysrgb&w=300"
                alt="Birthday party drum show"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-4">Why Book a Drum Show?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center text-yellow-600 mt-0.5">
                    <Check className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Unique Entertainment</h3>
                    <p className="text-sm text-muted-foreground">
                      Stand out with a performance that guests will remember.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center text-yellow-600 mt-0.5">
                    <Check className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Interactive Experience</h3>
                    <p className="text-sm text-muted-foreground">
                      Guests can participate in drum circles and rhythm activities.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center text-yellow-600 mt-0.5">
                    <Check className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Customizable Shows</h3>
                    <p className="text-sm text-muted-foreground">Tailor the performance to match your event theme.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center text-yellow-600 mt-0.5">
                    <Check className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Professional Performers</h3>
                    <p className="text-sm text-muted-foreground">Experienced drummers with stage presence and skill.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-2xl font-bold mb-4">Available Show Types</h2>
          <div className="space-y-4 mb-8">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-1">Solo Drum Performance</h3>
              <p className="text-sm text-muted-foreground mb-2">
                A single drummer showcasing various styles and techniques.
              </p>
              <p className="text-sm font-medium">Starting at $300 for 1 hour</p>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-1">Drum Duo or Trio</h3>
              <p className="text-sm text-muted-foreground mb-2">Multiple drummers performing synchronized routines.</p>
              <p className="text-sm font-medium">Starting at $500 for 1 hour</p>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-1">Interactive Drum Circle</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Lead drummer guides participants in a group drumming experience.
              </p>
              <p className="text-sm font-medium">Starting at $400 for 1 hour</p>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-1">Custom Performance</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Tailored to your specific event needs and preferences.
              </p>
              <p className="text-sm font-medium">Price varies based on requirements</p>
            </div>
          </div>
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-6">Request a Drum Show</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Enter your full name" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="Enter your email" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="Enter your phone number" required />
                </div>

                <div className="space-y-2">
                  <Label>Event Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Select event date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventType">Event Type</Label>
                  <Select>
                    <SelectTrigger id="eventType">
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="corporate">Corporate Event</SelectItem>
                      <SelectItem value="wedding">Wedding</SelectItem>
                      <SelectItem value="birthday">Birthday Party</SelectItem>
                      <SelectItem value="school">School Event</SelectItem>
                      <SelectItem value="festival">Festival</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="showType">Show Type</Label>
                  <Select>
                    <SelectTrigger id="showType">
                      <SelectValue placeholder="Select show type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solo">Solo Drum Performance</SelectItem>
                      <SelectItem value="duo">Drum Duo or Trio</SelectItem>
                      <SelectItem value="interactive">Interactive Drum Circle</SelectItem>
                      <SelectItem value="custom">Custom Performance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Select>
                    <SelectTrigger id="duration">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 hour</SelectItem>
                      <SelectItem value="2">2 hours</SelectItem>
                      <SelectItem value="3">3 hours</SelectItem>
                      <SelectItem value="custom">Custom duration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Event Location</Label>
                  <Input id="location" placeholder="Enter event location" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="attendees">Expected Number of Attendees</Label>
                  <Select>
                    <SelectTrigger id="attendees">
                      <SelectValue placeholder="Select attendee count" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-50">1-50 people</SelectItem>
                      <SelectItem value="51-100">51-100 people</SelectItem>
                      <SelectItem value="101-200">101-200 people</SelectItem>
                      <SelectItem value="201+">201+ people</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="details">Additional Details</Label>
                  <Textarea
                    id="details"
                    placeholder="Tell us more about your event and any specific requirements"
                    className="min-h-[100px]"
                  />
                </div>

                <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black">
                  Submit Request
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
