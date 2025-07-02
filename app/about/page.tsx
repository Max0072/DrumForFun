import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, MapPin, Phone } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-6">About DrumForFun</h1>
          <p className="text-muted-foreground mb-6">
            Founded in 2015, DrumForFun started as a small drum school with a vision to create a space where music
            enthusiasts of all ages could learn, practice, and celebrate music together.
          </p>
          <p className="text-muted-foreground mb-6">
            Over the years, we've grown into a comprehensive music hub offering drum and guitar lessons, rehearsal
            spaces, equipment rental, retail products, and entertainment services. Our mission is to make music
            accessible to everyone and create a vibrant community of musicians.
          </p>
          <p className="text-muted-foreground mb-8">
            Whether you're taking your first steps in music or you're a seasoned professional, DrumForFun provides the
            resources, guidance, and environment you need to thrive.
          </p>
          <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-black">
            <Link href="/booking">Book a Session</Link>
          </Button>
        </div>
        <div className="relative h-[400px] rounded-lg overflow-hidden">
          <Image
            src="https://images.pexels.com/photos/995301/pexels-photo-995301.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="DrumForFun studio with drum kits"
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <TeamMember
            name="Alex Johnson"
            role="Founder & Head Drum Instructor"
            image="https://images.pexels.com/photos/8412414/pexels-photo-8412414.jpeg?auto=compress&cs=tinysrgb&w=400"
            bio="Professional drummer with 15+ years of experience performing and teaching."
          />
          <TeamMember
            name="Sarah Williams"
            role="Lead Guitar Instructor"
            image="https://images.pexels.com/photos/7095517/pexels-photo-7095517.jpeg?auto=compress&cs=tinysrgb&w=400"
            bio="Classically trained guitarist specializing in rock, jazz, and blues styles."
          />
          <TeamMember
            name="Michael Brown"
            role="Studio Manager"
            image="https://images.unsplash.com/photo-1445985543470-41fba5c3144a?auto=compress&cs=tinysrgb&w=400"
            bio="Manages our facilities and ensures everything runs smoothly for our clients."
          />
          <TeamMember
            name="Emily Chen"
            role="Events Coordinator"
            image="https://images.unsplash.com/photo-1445985543470-41fba5c3144a?auto=compress&cs=tinysrgb&w=400"
            bio="Organizes performances, parties, and special events at our venue."
          />
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Our Facilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FacilityCard
            title="Rehearsal Rooms"
            image="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=600&auto=format&fit=crop"
            description="Soundproofed rooms equipped with professional drum kits, amplifiers, and PA systems."
          />
          <FacilityCard
            title="Lesson Studios"
            image="https://images.unsplash.com/photo-1524230659092-07f99a75c013?q=80&w=600&auto=format&fit=crop"
            description="Comfortable spaces designed for one-on-one instruction with all necessary equipment."
          />
          <FacilityCard
            title="Performance Space"
            image="https://images.unsplash.com/photo-1501612780327-45045538702b?q=80&w=600&auto=format&fit=crop"
            description="A small venue perfect for recitals, drum circles, and private events."
          />
        </div>
      </div>

      {/* Drum Gallery Section */}
      <div className="mb-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Our Drum Collection</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1543443258-92b04ad5ec6b?q=80&w=400&auto=format&fit=crop"
              alt="Professional acoustic drum kit"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1445985543470-41fba5c3144a?q=80&w=400&auto=format&fit=crop"
              alt="Electronic drum kit"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1445985543470-41fba5c3144a?q=80&w=400&auto=format&fit=crop"
              alt="Vintage drum set"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?q=80&w=400&auto=format&fit=crop"
              alt="Percussion instruments"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1602934585418-f588bea4215c?q=80&w=400&auto=format&fit=crop"
              alt="Drum cymbals collection"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1603969072881-b0fc7f3d77d7?q=80&w=400&auto=format&fit=crop"
              alt="Snare drums"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?q=80&w=400&auto=format&fit=crop"
              alt="Drum hardware"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1617994679330-2883951d0073?q=80&w=400&auto=format&fit=crop"
              alt="Drum sticks and mallets"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Contact Us</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-yellow-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">Our Location</h3>
                  <p className="text-muted-foreground">123 Music Street, Rhythm City, RC 10101</p>
                  <p className="text-muted-foreground mt-1">
                    We're located in downtown Rhythm City, with easy access to public transportation and parking.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="h-6 w-6 text-yellow-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">Phone</h3>
                  <p className="text-muted-foreground">(555) 123-4567</p>
                  <p className="text-muted-foreground mt-1">
                    Available Monday-Friday: 9am-8pm
                    <br />
                    Saturday: 10am-6pm
                    <br />
                    Sunday: 12pm-5pm
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="h-6 w-6 text-yellow-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">Email</h3>
                  <p className="text-muted-foreground">info@drumforfun.com</p>
                  <p className="text-muted-foreground mt-1">
                    For general inquiries, bookings, and information about our services.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="font-semibold text-lg mb-4">Business Hours</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span>10:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>12:00 PM - 5:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>
                  <input id="name" className="w-full p-2 border rounded-md" placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <input id="email" type="email" className="w-full p-2 border rounded-md" placeholder="Your email" />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">
                  Subject
                </label>
                <input id="subject" className="w-full p-2 border rounded-md" placeholder="Subject" />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full p-2 border rounded-md"
                  placeholder="Your message"
                ></textarea>
              </div>
              <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black">Send Message</Button>
            </form>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Find Us</h2>
        <div className="h-[400px] rounded-lg overflow-hidden bg-muted flex items-center justify-center">
          <p className="text-muted-foreground">Interactive map would be embedded here</p>
        </div>
      </div>
    </div>
  )
}

function TeamMember({ name, role, image, bio }: { name: string; role: string; image: string; bio: string }) {
  return (
    <div className="text-center">
      <div className="relative h-64 w-64 mx-auto rounded-full overflow-hidden mb-4">
        <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
      </div>
      <h3 className="font-semibold text-lg">{name}</h3>
      <p className="text-yellow-500 mb-2">{role}</p>
      <p className="text-sm text-muted-foreground">{bio}</p>
    </div>
  )
}

function FacilityCard({ title, image, description }: { title: string; image: string; description: string }) {
  return (
    <Card>
      <div className="relative h-48 overflow-hidden">
        <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
