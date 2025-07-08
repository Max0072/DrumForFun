import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Music, Calendar, Gift, Headphones, ShoppingBag, Drum } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?q=80&w=1920&auto=format&fit=crop"
            alt="Drummer performing on stage"
            fill
            className="object-cover brightness-50"
            priority
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 animate-fade-in">BEAT THE RHYTHM, FEEL THE MUSIC</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Your one-stop destination for learning, practicing, and celebrating music
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black">
              <Link href="/booking">Book a Session</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="dark:text-white text-black hover:bg-white/10">
              <Link href="/booking?type=party">Book a party</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Services</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ServiceCard
              icon={<Calendar className="h-10 w-10 text-yellow-500" />}
              title="Rehearsal Rooms"
              description="Book a private space for individual practice or band rehearsals"
              link="/booking"
              linkText="Book Now"
            />


            <ServiceCard
                icon={<Gift className="h-10 w-10 text-yellow-500" />}
                title="Birthday Parties"
                description="Celebrate your special day with music and fun activities"
                link="/booking?type=party"
                linkText="Plan Your Party"
            />


            <ServiceCard
              icon={<Headphones className="h-10 w-10 text-yellow-500" />}
              title="Equipment Rental"
              description="Rent professional music equipment for your events"
              link="/rental"
              linkText="View Equipment"
            />


            {/*<ServiceCard*/}
            {/*  icon={<Music className="h-10 w-10 text-yellow-500" />}*/}
            {/*  title="Music Lessons"*/}
            {/*  description="Learn drums or guitar with our experienced instructors"*/}
            {/*  link="/lessons"*/}
            {/*  linkText="View Lessons"*/}
            {/*/>*/}


            {/*<ServiceCard*/}
            {/*  icon={<ShoppingBag className="h-10 w-10 text-yellow-500" />}*/}
            {/*  title="Music Store"*/}
            {/*  description="Shop quality instruments, accessories, and merchandise"*/}
            {/*  link="/store"*/}
            {/*  linkText="Shop Now"*/}
            {/*/>*/}


            {/*<ServiceCard*/}
            {/*  icon={<Drum className="h-10 w-10 text-yellow-500" />}*/}
            {/*  title="Drum Shows"*/}
            {/*  description="Book our talented drummers for your next event"*/}
            {/*  link="/drum-show"*/}
            {/*  linkText="Book a Show"*/}
            {/*/>*/}
          </div>
        </div>
      </section>

      {/* Featured Drummers Section */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Featured Drummers</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative overflow-hidden rounded-lg group">
              <div className="aspect-[3/4] relative">
                <Image
                  src="https://images.pexels.com/photos/8412414/pexels-photo-8412414.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Rock drummer performing"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-xl font-bold text-yellow-400">Alex Thompson</h3>
                <p className="text-sm">Rock & Metal Specialist</p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-lg group">
              <div className="aspect-[3/4] relative">
                <Image
                  src="https://images.pexels.com/photos/7095517/pexels-photo-7095517.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Jazz drummer performing"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-xl font-bold text-yellow-400">Maria Rodriguez</h3>
                <p className="text-sm">Jazz & Fusion Expert</p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-lg group">
              <div className="aspect-[3/4] relative">
                <Image
                  src="https://images.pexels.com/photos/1493755/pexels-photo-1493755.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Percussion drummer performing"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-xl font-bold text-yellow-400">James Wilson</h3>
                <p className="text-sm">Percussion & World Rhythms</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <Button
              asChild
              variant="outline"
              className="bg-yellow-500 dark:bg-transparent text-black dark:text-yellow-500 border-yellow-500 hover:bg-yellow-600 dark:hover:bg-yellow-500/10"
            >
              <Link href="/about">Meet Our Team</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What Our Students Say</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="DrumForFun transformed my drumming skills in just a few months. The instructors are amazing!"
              author="Alex Johnson"
              role="Drum Student"
            />

            <TestimonialCard
              quote="The rehearsal rooms are top-notch with great acoustics. Perfect for our band practice sessions."
              author="Sarah Williams"
              role="Band Member"
            />

            <TestimonialCard
              quote="My son had the best birthday party here. The drum circle activity was a hit with all the kids!"
              author="Michael Brown"
              role="Parent"
            />
          </div>
        </div>
      </section>

      {/* Drum Kit Showcase */}
      <section className="py-16 bg-background dark:bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">Our Premium Drum Kits</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            We use and sell only the highest quality drum kits and equipment to ensure the best sound and performance.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group relative overflow-hidden rounded-lg">
              <div className="aspect-square relative">
                <Image
                  src="https://images.pexels.com/photos/995301/pexels-photo-995301.jpeg?auto=compress&cs=tinysrgb&w=500"
                  alt="Professional acoustic drum kit"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-yellow-400 font-bold">Professional Acoustic Kit</h3>
                <p className="text-white text-sm">Available for lessons and rehearsals</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-lg">
              <div className="aspect-square relative">
                <Image
                  src="https://images.unsplash.com/photo-1445985543470-41fba5c3144a?q=80&w=500&auto=format&fit=crop"
                  alt="Electronic drum kit"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-yellow-400 font-bold">Electronic Drum Kit</h3>
                <p className="text-white text-sm">Perfect for silent practice sessions</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-lg">
              <div className="aspect-square relative">
                <Image
                  src="https://images.pexels.com/photos/5089118/pexels-photo-5089118.jpeg?auto=compress&cs=tinysrgb&w=500"
                  alt="Percussion set"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-yellow-400 font-bold">Percussion Set</h3>
                <p className="text-white text-sm">Explore world rhythms and techniques</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-lg">
              <div className="aspect-square relative">
                <Image
                  src="https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?q=80&w=500&auto=format&fit=crop"
                  alt="Compact travel drum kit"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-yellow-400 font-bold">Travel Drum Kit</h3>
                <p className="text-white text-sm">Compact and portable for musicians on the go</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <Button
              asChild
              variant="outline"
              className="bg-yellow-500 dark:bg-transparent text-black dark:text-yellow-500 border-yellow-500 hover:bg-yellow-600 dark:hover:bg-yellow-500/10"
            >
              <Link href="/store">Shop Drum Equipment</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-yellow-500 text-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Musical Journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Join our community of musicians and music enthusiasts today!</p>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-black bg-yellow-500 text-black/100 dark:bg-black/100 dark:text-yellow-500 dark:hover:bg-black/80 hover:bg-yellow-600"
          >
            <Link href="/booking">Get Started</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

function ServiceCard({
  icon,
  title,
  description,
  link,
  linkText,
}: {
  icon: React.ReactNode
  title: string
  description: string
  link: string
  linkText: string
}) {
  return (
    <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-md dark:hover:shadow-yellow-500/10">
      <CardHeader>
        <div className="mb-4">{icon}</div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto pt-4">
        <Button asChild variant="outline" className="w-full">
          <Link href={link}>{linkText}</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

function TestimonialCard({ quote, author, role }: { quote: string; author: string; role: string }) {
  return (
    <Card className="h-full transition-all duration-300 hover:shadow-md dark:hover:shadow-yellow-500/10">
      <CardContent className="pt-6">
        <blockquote className="text-lg italic mb-4">"{quote}"</blockquote>
        <div className="flex items-center">
          <div className="ml-4">
            <p className="font-semibold">{author}</p>
            <p className="text-sm text-muted-foreground">{role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
