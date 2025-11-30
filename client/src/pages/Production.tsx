import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function Production() {
  const steps = [
    {
      number: 1,
      title: "Selection",
      description: "We carefully select the finest peanuts from trusted local suppliers, ensuring only the best quality nuts make it to our production facility.",
      image: "/assets/IMG-20250725-WA0008.jpg",
    },
    {
      number: 2,
      title: "Roasting",
      description: "Our peanuts are hand-roasted in small batches to achieve the perfect balance of flavor and texture. This is where the magic happens.",
      image: "/assets/IMG-20250711-WA0036.jpg",
    },
    {
      number: 3,
      title: "Grinding",
      description: "The roasted peanuts are ground to a smooth, creamy consistency using traditional methods that preserve the natural oils and nutrients.",
      image: "/assets/IMG-20250706-WA0003.jpg",
    },
    {
      number: 4,
      title: "Quality Check",
      description: "Every batch undergoes rigorous quality testing to ensure it meets our high standards for taste, texture, and nutritional value.",
      image: "/assets/IMG-20250705-WA0005.jpg",
    },
    {
      number: 5,
      title: "Packaging",
      description: "We package our peanut butter in premium jars that preserve freshness and maintain the quality of our product from factory to your table.",
      image: "/assets/IMG-20250711-WA0034.jpg",
    },
    {
      number: 6,
      title: "Delivery",
      description: "Your jar of Nuta is carefully packed and shipped directly to you, ensuring it arrives fresh and ready to enjoy.",
      image: "/assets/33bc0d80-c034-11f0-b827-f91fa4ecc710(1).png",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Production Process</h1>
            <p className="text-xl text-muted-foreground">
              From seed to jar, we control every step to ensure the highest quality peanut butter.
            </p>
          </div>
        </div>
      </section>

      {/* Production Steps */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="space-y-16">
            {steps.map((step, index) => (
              <div key={step.number}>
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? "md:grid-flow-dense" : ""}`}>
                  {/* Content */}
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary text-primary-foreground font-bold text-lg">
                        {step.number}
                      </div>
                      <h2 className="text-3xl font-bold">{step.title}</h2>
                    </div>
                    <p className="text-lg text-muted-foreground mb-6">
                      {step.description}
                    </p>
                    <div className="flex items-center gap-2 text-primary font-medium">
                      <CheckCircle className="h-5 w-5" />
                      Quality Assured
                    </div>
                  </div>

                  {/* Image */}
                  <div className={`bg-secondary/30 rounded-lg p-8 flex items-center justify-center min-h-96 ${index % 2 === 1 ? "md:col-start-1" : ""}`}>
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </div>

                {/* Divider */}
                {index < steps.length - 1 && (
                  <div className="my-12 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications & Standards */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Commitment</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8">
              <h3 className="text-xl font-semibold mb-3">100% Natural Ingredients</h3>
              <p className="text-muted-foreground">
                No preservatives, no additives, no artificial flavors. Just pure, roasted peanuts.
              </p>
            </Card>

            <Card className="p-8">
              <h3 className="text-xl font-semibold mb-3">Hygiene & Safety</h3>
              <p className="text-muted-foreground">
                Our facility follows strict hygiene standards to ensure every jar is safe and clean.
              </p>
            </Card>

            <Card className="p-8">
              <h3 className="text-xl font-semibold mb-3">Nutritional Excellence</h3>
              <p className="text-muted-foreground">
                Rich in protein, healthy fats, and essential nutrients. A nutritious choice for your family.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Nutrition Facts */}
      <section className="py-16 md:py-24">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Nutrition Facts</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-8">
              <h3 className="font-semibold mb-6 text-lg">Per 100g</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Energy</span>
                  <span className="font-medium">580 kcal</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Protein</span>
                  <span className="font-medium">25g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fat Total</span>
                  <span className="font-medium">50g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Saturated Fat</span>
                  <span className="font-medium">10g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Carbohydrates</span>
                  <span className="font-medium">20g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sugars</span>
                  <span className="font-medium">5g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fiber</span>
                  <span className="font-medium">6mg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sodium</span>
                  <span className="font-medium">0mg</span>
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <h3 className="font-semibold mb-6 text-lg">Ingredients</h3>
              <p className="text-muted-foreground mb-4">
                100% Pure Roasted Peanuts
              </p>
              <h4 className="font-semibold mb-3">Storage Instructions</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Keep in a cool, dry place</li>
                <li>• Refrigerate after opening</li>
                <li>• Stir before use if oil separates</li>
                <li>• Best consumed within 3 months of opening</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
