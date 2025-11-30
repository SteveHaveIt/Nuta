import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Leaf, Award } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Nuta</h1>
            <p className="text-xl text-muted-foreground">
              Pure Love in a Jar. Crafted with care, made from the finest natural peanuts.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
              <p className="text-lg text-muted-foreground mb-4">
                Nuta was born from a simple belief: that peanut butter should be pure, natural, and delicious. 
                Created by Steve Have It Enterprise Hub, we've dedicated ourselves to crafting the finest peanut 
                butter products without compromises.
              </p>
              <p className="text-lg text-muted-foreground mb-4">
                Every jar of Nuta is made from 100% roasted peanuts, hand-selected for quality and flavor. 
                We believe in transparency, quality, and supporting local communities. No preservatives, 
                no additives—just pure peanut goodness.
              </p>
              <p className="text-lg text-muted-foreground">
                Our mission is simple: to bring the natural taste and nutrition of real peanuts to your table, 
                one jar at a time.
              </p>
            </div>
            <div className="bg-secondary/30 rounded-lg p-8 flex items-center justify-center min-h-96">
              <img
                src="/assets/IMG-20250725-WA0012.jpg"
                alt="Steve Have It"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Values</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Leaf className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">100% Natural</h3>
              <p className="text-muted-foreground">
                We use only the finest natural peanuts, roasted to perfection. No preservatives, 
                no additives, no compromises.
              </p>
            </Card>

            <Card className="p-8">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Made with Care</h3>
              <p className="text-muted-foreground">
                Every jar is crafted with attention to detail and a passion for quality. 
                We care about what goes into your food.
              </p>
            </Card>

            <Card className="p-8">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Local Pride</h3>
              <p className="text-muted-foreground">
                Proudly made in Kenya by Steve Have It Enterprise Hub. Supporting local 
                quality and craftsmanship.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-16 md:py-24">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Leadership</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <Card className="p-8 text-center">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-secondary/30 flex items-center justify-center">
                <img
                  src="/assets/IMG-20250725-WA0012.jpg"
                  alt="Steve Have It"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <h3 className="text-xl font-semibold mb-1">Steve Have It</h3>
              <p className="text-muted-foreground mb-4">Founder & CEO</p>
              <p className="text-sm text-muted-foreground">
                Visionary entrepreneur dedicated to creating premium natural products 
                that make a difference in people's lives.
              </p>
            </Card>

            <Card className="p-8 text-center">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-secondary/30 flex items-center justify-center">
                <div className="text-4xl">🤝</div>
              </div>
              <h3 className="text-xl font-semibold mb-1">LinkNexus Solutions</h3>
              <p className="text-muted-foreground mb-4">Strategic Partner</p>
              <p className="text-sm text-muted-foreground">
                Connecting opportunities and bridging success. Our valued partner in 
                growth and innovation.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get in Touch</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Have questions about Nuta? We'd love to hear from you. Reach out to our team today.
          </p>
          <Link href="/contact">
            <Button size="lg" variant="secondary">
              Contact Us
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
