export default function Footer() {
  return (
    <footer className="bg-amber-900/5 border-t border-amber-900/10 mt-16">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-serif font-bold text-amber-900 mb-4">Rusty Nuts</h3>
            <p className="text-amber-800/70">Small Engine Repair</p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-amber-900 mb-4">Contact Us</h3>
            <div className="space-y-2 text-amber-800/80">
              <p className="flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>(555) 123-4567</span>
              </p>
              <p className="flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>contact@rustynuts.com</span>
              </p>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-lg font-semibold text-amber-900 mb-4">Hours</h3>
            <div className="space-y-2 text-amber-800/80">
              <p>Monday - Friday: 8am - 6pm</p>
              <p>Saturday: 9am - 4pm</p>
              <p>Sunday: Closed</p>
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="text-lg font-semibold text-amber-900 mb-4">Location</h3>
            <div className="space-y-2 text-amber-800/80">
              <p>123 Workshop Lane</p>
              <p>Snowville, MN 55555</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-amber-900/10 text-center text-amber-800/60">
          <p>&copy; {new Date().getFullYear()} Rusty Nuts. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
} 