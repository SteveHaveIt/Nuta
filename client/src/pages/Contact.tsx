import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { toast } from "sonner";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Here you would send the form data to your backend
      // For now, just show a success message
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
            <p className="text-xl text-muted-foreground">
              Have questions about Nuta? We'd love to hear from you. Reach out to our team.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Contact Info Cards */}
            <Card className="p-8">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Phone</h3>
              <p className="text-muted-foreground mb-1">+254 742 101 089</p>
              <p className="text-sm text-muted-foreground">Mon-Fri, 9am-5pm EAT</p>
            </Card>

            <Card className="p-8">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Email</h3>
              <p className="text-muted-foreground mb-1">info.stevehaveit@gmail.com</p>
              <p className="text-sm text-muted-foreground">We'll respond within 24 hours</p>
            </Card>

            <Card className="p-8">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Address</h3>
              <p className="text-muted-foreground text-sm">
                Nairobi, Embakasi North<br />
                Kariobangi Market<br />
                Kenya
              </p>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Name *</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <Input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+254..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Subject *</label>
                  <Input
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="How can we help?"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us more..."
                    rows={6}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Card>

            {/* Info Section */}
            <div className="space-y-8">
              <Card className="p-8">
                <h3 className="text-xl font-semibold mb-4">Business Hours</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monday - Friday</span>
                    <span className="font-medium">9:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Saturday</span>
                    <span className="font-medium">10:00 AM - 3:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sunday</span>
                    <span className="font-medium">Closed</span>
                  </div>
                </div>
              </Card>

              <Card className="p-8">
                <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
                <p className="text-muted-foreground mb-4">
                  Connect with us on social media for the latest updates and promotions.
                </p>
                <div className="flex gap-4">
                  <a href="https://instagram.com/steve_have_it" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors">
                    Instagram
                  </a>
                  <a href="https://facebook.com/stevehaveit" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors">
                    Facebook
                  </a>
                  <a href="https://twitter.com/stevehaveit" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors">
                    Twitter
                  </a>
                </div>
              </Card>

              <Card className="p-8 bg-primary/5">
                <div className="flex gap-3">
                  <Clock className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Quick Response</h4>
                    <p className="text-sm text-muted-foreground">
                      We typically respond to inquiries within 24 hours during business hours.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-6">
              <h3 className="font-semibold mb-3">How long does shipping take?</h3>
              <p className="text-muted-foreground text-sm">
                We ship orders within 1-2 business days. Delivery typically takes 3-5 business days within Nairobi and up to 7 days for other regions.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-3">Can I return a product?</h3>
              <p className="text-muted-foreground text-sm">
                Yes, we offer a 30-day money-back guarantee if you're not satisfied with your purchase. Contact us for details.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-3">Do you offer bulk orders?</h3>
              <p className="text-muted-foreground text-sm">
                Absolutely! For bulk or wholesale inquiries, please contact us directly and we'll provide special pricing.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-3">Is Nuta suitable for allergies?</h3>
              <p className="text-muted-foreground text-sm">
                Nuta contains peanuts. If you have a peanut allergy, please avoid our products. Always check labels carefully.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
