"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Check, Drum, Guitar } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"

function LessonsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedInstrument, setSelectedInstrument] = useState("drums")

  // Получаем инструмент из URL параметров при загрузке
  useEffect(() => {
    const instrumentParam = searchParams.get("instrument")
    if (instrumentParam === "guitar" || instrumentParam === "drums") {
      setSelectedInstrument(instrumentParam)
    }
  }, [searchParams])

  // Изменим функцию handleInstrumentChange, чтобы использовать router.replace() вместо router.push()
  // Это заменит текущую запись в истории браузера вместо добавления новой

  const handleInstrumentChange = (instrument: string) => {
    setSelectedInstrument(instrument)
    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.set("instrument", instrument)
    router.replace(`/lessons?${newSearchParams.toString()}`, { scroll: false })
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Music Lessons</h1>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Learn to play drums or guitar with our experienced instructors. Choose from individual lessons or subscribe to
          a package for regular sessions.
        </p>
      </div>

      <Tabs value={selectedInstrument} onValueChange={handleInstrumentChange} className="max-w-5xl mx-auto">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="drums" className="flex items-center justify-center gap-2">
            <Drum className="h-4 w-4" />
            Drum Lessons
          </TabsTrigger>
          <TabsTrigger value="guitar" className="flex items-center justify-center gap-2">
            <Guitar className="h-4 w-4" />
            Guitar Lessons
          </TabsTrigger>
        </TabsList>

        <TabsContent value="drums">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div>
              <h2 className="text-2xl font-bold mb-4">Learn to Play Drums</h2>
              <p className="text-muted-foreground mb-4">
                Our drum lessons are designed for all skill levels, from complete beginners to advanced players looking
                to refine their technique. Our experienced instructors will guide you through:
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <span>Proper drumming technique and posture</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <span>Reading drum notation and charts</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <span>Playing different styles (rock, jazz, funk, etc.)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <span>Developing speed, control, and coordination</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <span>Creating your own drum patterns and solos</span>
                </li>
              </ul>
              <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-black">
                <Link href="/book-lesson?instrument=drums&type=trial">Book a Trial Lesson</Link>
              </Button>
            </div>
            <div className="relative h-[300px] md:h-full rounded-lg overflow-hidden">
              <Image
                src="https://images.pexels.com/photos/8412414/pexels-photo-8412414.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Instructor teaching drum lessons"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Drum Lesson Gallery */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Our Drum Lessons in Action</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <Image
                  src="https://images.pexels.com/photos/7095517/pexels-photo-7095517.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Student learning basic drum techniques"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1445985543470-41fba5c3144a?auto=compress&cs=tinysrgb&w=600"
                  alt="Group drum lesson in progress"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1445985543470-41fba5c3144a?auto=compress&cs=tinysrgb&w=600"
                  alt="Advanced drum student performing"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-6 text-center">Drum Lesson Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PricingCard
              title="Single Lesson"
              price="$45"
              description="Perfect for trying out lessons or occasional practice"
              features={[
                "60-minute private lesson",
                "Personalized instruction",
                "All equipment provided",
                "Flexible scheduling",
                "No commitment required",
              ]}
              buttonText="Book Now"
              buttonLink="/book-lesson?instrument=drums&type=single"
            />

            <PricingCard
              title="Monthly Package"
              price="$160"
              description="4 lessons per month (save $20)"
              features={[
                "Weekly 60-minute lessons",
                "Personalized curriculum",
                "Progress tracking",
                "All equipment provided",
                "Practice resources",
              ]}
              buttonText="Subscribe"
              buttonLink="/book-lesson?instrument=drums&type=package-4"
              popular
            />

            <PricingCard
              title="Quarterly Package"
              price="$440"
              description="12 lessons over 3 months (save $100)"
              features={[
                "Weekly 60-minute lessons",
                "Comprehensive curriculum",
                "Progress tracking",
                "All equipment provided",
                "Video recording of progress",
                "Take-home practice materials",
              ]}
              buttonText="Subscribe"
              buttonLink="/book-lesson?instrument=drums&type=package-12"
            />
          </div>
        </TabsContent>

        <TabsContent value="guitar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div>
              <h2 className="text-2xl font-bold mb-4">Learn to Play Guitar</h2>
              <p className="text-muted-foreground mb-4">
                Our guitar lessons cater to all skill levels, from beginners picking up a guitar for the first time to
                advanced players looking to master complex techniques. Our instructors will help you with:
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <span>Proper hand positioning and technique</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <span>Reading guitar tablature and music notation</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <span>Chord progressions and strumming patterns</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <span>Various playing styles (acoustic, electric, fingerstyle)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <span>Music theory and improvisation</span>
                </li>
              </ul>
              <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-black">
                <Link href="/book-lesson?instrument=guitar&type=trial">Book a Trial Lesson</Link>
              </Button>
            </div>
            <div className="relative h-[300px] md:h-full rounded-lg overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1525201548942-d8732f6617a0?q=80&w=800&auto=format&fit=crop"
                alt="Guitar instructor teaching student"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-6 text-center">Guitar Lesson Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PricingCard
              title="Single Lesson"
              price="$40"
              description="Perfect for trying out lessons or occasional practice"
              features={[
                "60-minute private lesson",
                "Personalized instruction",
                "Guitar provided if needed",
                "Flexible scheduling",
                "No commitment required",
              ]}
              buttonText="Book Now"
              buttonLink="/book-lesson?instrument=guitar&type=single"
            />

            <PricingCard
              title="Monthly Package"
              price="$140"
              description="4 lessons per month (save $20)"
              features={[
                "Weekly 60-minute lessons",
                "Personalized curriculum",
                "Progress tracking",
                "Guitar provided if needed",
                "Sheet music and tabs provided",
              ]}
              buttonText="Subscribe"
              buttonLink="/book-lesson?instrument=guitar&type=package-4"
              popular
            />

            <PricingCard
              title="Quarterly Package"
              price="$380"
              description="12 lessons over 3 months (save $100)"
              features={[
                "Weekly 60-minute lessons",
                "Comprehensive curriculum",
                "Progress tracking",
                "Guitar provided if needed",
                "Digital recordings of lessons",
                "Custom practice materials",
              ]}
              buttonText="Subscribe"
              buttonLink="/book-lesson?instrument=guitar&type=package-12"
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-16 bg-muted rounded-lg p-8 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">Do I need my own instrument?</h3>
            <p className="text-muted-foreground">
              No, we provide all instruments for lessons at our studio. If you're learning at home, we can help you find
              the right instrument to purchase or rent.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">How long does it take to learn?</h3>
            <p className="text-muted-foreground">
              Everyone progresses at their own pace. Most students can play simple songs within a few weeks, while
              mastery takes years of dedicated practice.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">What ages do you teach?</h3>
            <p className="text-muted-foreground">
              We teach students of all ages! For drums, we recommend starting at age 7+, and for guitar, age 6+, but we
              can accommodate younger students with special arrangements.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Can I switch instructors?</h3>
            <p className="text-muted-foreground">
              We want you to have the best learning experience possible. If you'd like to try a different instructor,
              just let us know.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function PricingCard({
  title,
  price,
  description,
  features,
  buttonText,
  buttonLink,
  popular = false,
}: {
  title: string
  price: string
  description: string
  features: string[]
  buttonText: string
  buttonLink: string
  popular?: boolean
}) {
  return (
    <Card className={cn("flex flex-col h-full", popular && "border-yellow-500 shadow-lg")}>
      <CardHeader>
        {popular && <Badge className="self-start mb-2 bg-yellow-500 text-black">Most Popular</Badge>}
        <CardTitle>{title}</CardTitle>
        <div>
          <span className="text-3xl font-bold">{price}</span>
          {title !== "Single Lesson" && <span className="text-muted-foreground"> / package</span>}
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className="h-5 w-5 text-yellow-500 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          asChild
          className={cn(
            "w-full",
            popular
              ? "bg-yellow-500 hover:bg-yellow-600 text-black"
              : "bg-muted-foreground/80 hover:bg-muted-foreground",
          )}
        >
          <Link href={buttonLink}>{buttonText}</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default function LessonsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto py-10 px-4">Loading lessons...</div>}>
      <LessonsContent />
    </Suspense>
  )
}
