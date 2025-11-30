import { drizzle } from "drizzle-orm/mysql2";
import { categories, products } from "./drizzle/schema.ts";

const db = drizzle(process.env.DATABASE_URL);

const seedData = async () => {
  console.log("Seeding database...");

  // Insert categories
  const categoryData = [
    {
      name: "Peanut Butter",
      slug: "peanut-butter",
      description: "Pure, natural peanut butter made from 100% roasted peanuts",
      imageUrl: "/assets/33bc0d80-c034-11f0-b827-f91fa4ecc710(1).png",
    },
    {
      name: "Crunchy Nuts",
      slug: "crunchy-nuts",
      description: "Delicious roasted peanuts with a satisfying crunch",
      imageUrl: "/assets/IMG-20250711-WA0034.jpg",
    },
    {
      name: "Flavoured Spreads",
      slug: "flavoured-spreads",
      description: "Exciting flavored variations of our classic peanut butter",
      imageUrl: "/assets/IMG-20250711-WA0036.jpg",
    },
  ];

  await db.insert(categories).values(categoryData);
  console.log("Categories seeded");

  // Insert products
  const productData = [
    {
      categoryId: 1,
      name: "Nuta Peanut Butter 250g",
      slug: "nuta-peanut-butter-250g",
      description: "Nuta Peanut Butter is made from 100% pure roasted peanuts – nothing else. No preservatives. No additives. Just the natural flavor and richness of real nuts, hand-roasted and blended with care.",
      shortDescription: "Pure Love in a Jar. Just Nuta.",
      price: 35000, // 350 KES in cents
      compareAtPrice: 45000,
      imageUrl: "/assets/33bc0d80-c034-11f0-b827-f91fa4ecc710(1).png",
      images: JSON.stringify(["/assets/IMG-20250711-WA0034.jpg", "/assets/IMG-20250711-WA0036.jpg"]),
      weight: "250g",
      ingredients: "100% Pure Roasted Peanuts",
      nutritionalInfo: JSON.stringify({
        servingSize: "100g",
        energy: "580 kcal",
        protein: "25g",
        fatTotal: "50g",
        saturatedFat: "10g",
        carbohydrates: "20g",
        sugars: "5g",
        fiber: "6mg",
        sodium: "0mg"
      }),
      stock: 100,
      isActive: true,
      isFeatured: true,
      tags: JSON.stringify(["bestseller", "natural", "no-additives"]),
    },
    {
      categoryId: 1,
      name: "Nuta Peanut Butter 500g",
      slug: "nuta-peanut-butter-500g",
      description: "Nuta Peanut Butter is made from 100% pure roasted peanuts – nothing else. No preservatives. No additives. Just the natural flavor and richness of real nuts, hand-roasted and blended with care.",
      shortDescription: "Pure Love in a Jar. Just Nuta.",
      price: 65000, // 650 KES in cents
      compareAtPrice: 80000,
      imageUrl: "/assets/IMG-20250711-WA0036.jpg",
      images: JSON.stringify(["/assets/33bc0d80-c034-11f0-b827-f91fa4ecc710(1).png"]),
      weight: "500g",
      ingredients: "100% Pure Roasted Peanuts",
      nutritionalInfo: JSON.stringify({
        servingSize: "100g",
        energy: "580 kcal",
        protein: "25g",
        fatTotal: "50g",
        saturatedFat: "10g",
        carbohydrates: "20g",
        sugars: "5g",
        fiber: "6mg",
        sodium: "0mg"
      }),
      stock: 80,
      isActive: true,
      isFeatured: true,
      tags: JSON.stringify(["bestseller", "natural", "value-pack"]),
    },
    {
      categoryId: 1,
      name: "Nuta Peanut Butter 1kg",
      slug: "nuta-peanut-butter-1kg",
      description: "Nuta Peanut Butter is made from 100% pure roasted peanuts – nothing else. No preservatives. No additives. Just the natural flavor and richness of real nuts, hand-roasted and blended with care.",
      shortDescription: "Pure Love in a Jar. Just Nuta.",
      price: 120000, // 1200 KES in cents
      compareAtPrice: 150000,
      imageUrl: "/assets/IMG-20250706-WA0003.jpg",
      images: JSON.stringify(["/assets/33bc0d80-c034-11f0-b827-f91fa4ecc710(1).png"]),
      weight: "1kg",
      ingredients: "100% Pure Roasted Peanuts",
      nutritionalInfo: JSON.stringify({
        servingSize: "100g",
        energy: "580 kcal",
        protein: "25g",
        fatTotal: "50g",
        saturatedFat: "10g",
        carbohydrates: "20g",
        sugars: "5g",
        fiber: "6mg",
        sodium: "0mg"
      }),
      stock: 50,
      isActive: true,
      isFeatured: true,
      tags: JSON.stringify(["family-size", "natural", "best-value"]),
    },
  ];

  await db.insert(products).values(productData);
  console.log("Products seeded");

  console.log("Database seeding completed!");
  process.exit(0);
};

seedData().catch((error) => {
  console.error("Error seeding database:", error);
  process.exit(1);
});
