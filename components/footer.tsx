import Link from "next/link"
import { Music, Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-muted py-12 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Music className="h-6 w-6 text-yellow-500" />
              <span className="font-bold text-xl">DrumForFun</span>
            </Link>
            <p className="text-muted-foreground">
              Your one-stop destination for learning, practicing, and celebrating music.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-yellow-500">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-yellow-500">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="https://www.instagram.com/drum4fun.cy/" className="text-muted-foreground hover:text-yellow-500">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-yellow-500">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-yellow-500">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/booking" className="text-muted-foreground hover:text-yellow-500">
                  Booking
                </Link>
              </li>
              <li>
                <Link href="/lessons" className="text-muted-foreground hover:text-yellow-500">
                  Lessons
                </Link>
              </li>
              <li>
                <Link href="/store" className="text-muted-foreground hover:text-yellow-500">
                  Store
                </Link>
              </li>
              <li>
                <Link href="/rental" className="text-muted-foreground hover:text-yellow-500">
                  Equipment Rental
                </Link>
              </li>
              <li>
                <Link href="/drum-show" className="text-muted-foreground hover:text-yellow-500">
                  Drum Show
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-yellow-500">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/booking?type=individual" className="text-muted-foreground hover:text-yellow-500">
                  Individual Practice
                </Link>
              </li>
              <li>
                <Link href="/booking?type=band" className="text-muted-foreground hover:text-yellow-500">
                  Band Rehearsal
                </Link>
              </li>
              <li>
                <Link href="/booking?type=party" className="text-muted-foreground hover:text-yellow-500">
                  Birthday Parties
                </Link>
              </li>
              <li>
                <Link href="/lessons" className="text-muted-foreground hover:text-yellow-500">
                  Drum Lessons
                </Link>
              </li>
              <li>
                <Link href="/lessons" className="text-muted-foreground hover:text-yellow-500">
                  Guitar Lessons
                </Link>
              </li>
              <li>
                <Link href="/drum-show" className="text-muted-foreground hover:text-yellow-500">
                  Live Performances
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-yellow-500 mt-0.5" />
                <span className="text-muted-foreground">Petrou Tsirou 2B, Limassol 3021</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-yellow-500" />
                <span className="text-muted-foreground">+357 97413557</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-yellow-500" />
                <span className="text-muted-foreground">admin@drum4fun.club</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} DrumForFun. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
