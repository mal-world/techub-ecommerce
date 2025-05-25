import { FaRocket, FaShieldAlt, FaHeadset, FaMapMarkerAlt, FaPhone, FaEnvelope, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';
import { MdOutlinePayment, MdOutlineLocalShipping } from 'react-icons/md';
import { BsFillGearFill } from 'react-icons/bs';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About TECHUB</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Where cutting-edge technology meets seamless shopping experience
          </p>
        </div>
      </div>

      {/* Our Story */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            Founded in 2023, TECHUB began as a passion project between tech enthusiasts who wanted to create a one-stop shop for the latest and greatest in technology. Today, we've grown into a trusted destination for gamers, professionals, and tech lovers alike, offering carefully curated products with exceptional service.
          </p>
        </div>

        {/* Mission & Values */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <div className="flex justify-center mb-4">
              <FaRocket className="text-4xl text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">Our Mission</h3>
            <p className="text-gray-600">
              To bring the latest technology to your doorstep with unbeatable prices and exceptional service.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <div className="flex justify-center mb-4">
              <BsFillGearFill className="text-4xl text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">Our Vision</h3>
            <p className="text-gray-600">
              To become the most trusted tech retailer by innovating the online shopping experience.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <div className="flex justify-center mb-4">
              <FaShieldAlt className="text-4xl text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">Our Promise</h3>
            <p className="text-gray-600">
              Authentic products, expert advice, and customer service that goes above and beyond.
            </p>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Why Choose TECHUB?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <MdOutlinePayment className="text-2xl text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold mb-1">Secure Payments</h4>
                <p className="text-gray-600 text-sm">Multiple payment options with bank-level security</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <MdOutlineLocalShipping className="text-2xl text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold mb-1">Fast Shipping</h4>
                <p className="text-gray-600 text-sm">Reliable delivery with real-time tracking</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <FaHeadset className="text-2xl text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold mb-1">24/7 Support</h4>
                <p className="text-gray-600 text-sm">Dedicated team ready to assist you anytime</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <FaShieldAlt className="text-2xl text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold mb-1">Authentic Products</h4>
                <p className="text-gray-600 text-sm">100% genuine products with warranty</p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Meet Our Team</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[
              { name: "Alex Johnson", role: "CEO & Founder", img: "https://randomuser.me/api/portraits/men/32.jpg" },
              { name: "Sarah Chen", role: "Tech Director", img: "https://randomuser.me/api/portraits/women/44.jpg" },
              { name: "Marcus Lee", role: "Product Manager", img: "https://randomuser.me/api/portraits/men/75.jpg" },
              { name: "Priya Patel", role: "Customer Support", img: "https://randomuser.me/api/portraits/women/63.jpg" },
            ].map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden text-center">
                <img src={member.img} alt={member.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h4 className="font-bold">{member.name}</h4>
                  <p className="text-blue-600 text-sm">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 bg-blue-600 text-white p-8 md:p-12">
              <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <FaMapMarkerAlt className="mt-1 mr-4" />
                  <div>
                    <h4 className="font-bold">Address</h4>
                    <p>123 Tech Street, Silicon Valley, CA 94025</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FaPhone className="mt-1 mr-4" />
                  <div>
                    <h4 className="font-bold">Phone</h4>
                    <p>+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FaEnvelope className="mt-1 mr-4" />
                  <div>
                    <h4 className="font-bold">Email</h4>
                    <p>hello@techub.com</p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <h4 className="font-bold mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  <a href="#" className="hover:text-blue-300 transition"><FaTwitter className="text-xl" /></a>
                  <a href="#" className="hover:text-blue-300 transition"><FaInstagram className="text-xl" /></a>
                  <a href="#" className="hover:text-blue-300 transition"><FaLinkedin className="text-xl" /></a>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 p-8 md:p-12">
              <h3 className="text-xl font-bold mb-6">Send us a message</h3>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                  <input type="text" id="name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input type="email" id="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                  <textarea id="message" rows="4" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"></textarea>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;