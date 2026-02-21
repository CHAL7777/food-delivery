import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Insert sample categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'pizza' },
      update: {},
      create: {
        name: 'Pizza',
        slug: 'pizza',
        description: 'Delicious pizzas with various toppings',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'burger' },
      update: {},
      create: {
        name: 'Burger',
        slug: 'burger',
        description: 'Juicy burgers with fresh ingredients',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'pasta' },
      update: {},
      create: {
        name: 'Pasta',
        slug: 'pasta',
        description: 'Italian pasta dishes',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'salad' },
      update: {},
      create: {
        name: 'Salad',
        slug: 'salad',
        description: 'Fresh and healthy salads',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'drinks' },
      update: {},
      create: {
        name: 'Drinks',
        slug: 'drinks',
        description: 'Refreshing beverages',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'desserts' },
      update: {},
      create: {
        name: 'Desserts',
        slug: 'desserts',
        description: 'Sweet treats and desserts',
      },
    }),
  ])

  // Get category IDs
  const pizzaCat = categories.find(c => c.slug === 'pizza')!
  const burgerCat = categories.find(c => c.slug === 'burger')!
  const pastaCat = categories.find(c => c.slug === 'pasta')!
  const saladCat = categories.find(c => c.slug === 'salad')!
  const drinksCat = categories.find(c => c.slug === 'drinks')!
  const dessertsCat = categories.find(c => c.slug === 'desserts')!

  // Insert sample foods
  await Promise.all([
    prisma.food.create({
      data: {
        name: 'Margherita Pizza',
        description: 'Classic pizza with tomato sauce, mozzarella, and basil',
        price: 250,
        categoryId: pizzaCat.id,
        image: '/images/placeholder-food.svg',
        ingredients: ['Tomato sauce', 'Mozzarella', 'Basil', 'Olive oil'],
        preparationTime: 15,
        isFeatured: true,
      },
    }),
    prisma.food.create({
      data: {
        name: 'Pepperoni Pizza',
        description: 'Pizza with pepperoni, cheese, and tomato sauce',
        price: 300,
        categoryId: pizzaCat.id,
        image: '/images/placeholder-food.svg',
        ingredients: ['Tomato sauce', 'Mozzarella', 'Pepperoni'],
        preparationTime: 15,
        isFeatured: false,
      },
    }),
    prisma.food.create({
      data: {
        name: 'Classic Burger',
        description: 'Juicy beef burger with lettuce, tomato, and cheese',
        price: 200,
        categoryId: burgerCat.id,
        image: '/images/placeholder-food.svg',
        ingredients: ['Beef patty', 'Lettuce', 'Tomato', 'Cheese', 'Bun'],
        preparationTime: 10,
        isFeatured: true,
      },
    }),
    prisma.food.create({
      data: {
        name: 'Spaghetti Carbonara',
        description: 'Creamy pasta with bacon, eggs, and parmesan',
        price: 180,
        categoryId: pastaCat.id,
        image: '/images/placeholder-food.svg',
        ingredients: ['Spaghetti', 'Bacon', 'Eggs', 'Parmesan', 'Cream'],
        preparationTime: 12,
        isFeatured: false,
      },
    }),
    prisma.food.create({
      data: {
        name: 'Caesar Salad',
        description: 'Fresh romaine lettuce with caesar dressing and croutons',
        price: 120,
        categoryId: saladCat.id,
        image: '/images/placeholder-food.svg',
        ingredients: ['Romaine lettuce', 'Caesar dressing', 'Croutons', 'Parmesan'],
        preparationTime: 5,
        isFeatured: false,
      },
    }),
    prisma.food.create({
      data: {
        name: 'Coca Cola',
        description: 'Refreshing cola drink',
        price: 50,
        categoryId: drinksCat.id,
        image: '/images/placeholder-food.svg',
        ingredients: ['Coca Cola'],
        preparationTime: 1,
        isFeatured: false,
      },
    }),
    prisma.food.create({
      data: {
        name: 'Chocolate Cake',
        description: 'Rich chocolate cake with frosting',
        price: 150,
        categoryId: dessertsCat.id,
        image: '/images/placeholder-food.svg',
        ingredients: ['Chocolate', 'Flour', 'Sugar', 'Eggs', 'Frosting'],
        preparationTime: 20,
        isFeatured: true,
      },
    }),
  ])

  console.log('Database seeded successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })