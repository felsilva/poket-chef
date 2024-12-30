import '../models/recipe.dart';

List<Recipe> getSampleRecipes() {
  return [
    Recipe(
      id: '1',
      name: 'Pasta Carbonara',
      description:
          'Deliciosa pasta italiana con salsa cremosa de huevo y panceta',
      ingredients: [
        Ingredient(name: 'Spaghetti', quantity: 500, unit: 'g'),
        Ingredient(name: 'Huevos', quantity: 4, unit: 'unidades'),
        Ingredient(name: 'Panceta', quantity: 200, unit: 'g'),
        Ingredient(name: 'Queso parmesano', quantity: 100, unit: 'g'),
      ],
      steps: [
        'Cocinar la pasta en agua con sal',
        'Freír la panceta hasta que esté crujiente',
        'Mezclar huevos con queso rallado',
        'Combinar todo mientras la pasta está caliente',
      ],
      imageUrl:
          'https://images.unsplash.com/photo-1612874742237-6526221588e3?q=80&w=800',
      preparationTime: 30,
      difficulty: Difficulty.medium,
      authorId: 'sample_author',
      categories: ['Pasta', 'Italiana'],
      createdAt: DateTime.now(),
      servings: 4,
    ),
    Recipe(
      id: '2',
      name: 'Tacos al Pastor',
      description: 'Auténticos tacos mexicanos marinados con especias y piña',
      ingredients: [
        Ingredient(name: 'Carne de cerdo', quantity: 1000, unit: 'g'),
        Ingredient(name: 'Piña', quantity: 1, unit: 'unidad'),
        Ingredient(name: 'Tortillas', quantity: 12, unit: 'unidades'),
        Ingredient(name: 'Cilantro', quantity: 100, unit: 'g'),
        Ingredient(name: 'Cebolla', quantity: 1, unit: 'unidad'),
      ],
      steps: [
        'Marinar la carne con especias y piña',
        'Dejar reposar por 4 horas',
        'Cocinar en trompo o sartén',
        'Calentar las tortillas',
        'Servir con cilantro y cebolla',
      ],
      imageUrl:
          'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?q=80&w=800',
      preparationTime: 300,
      difficulty: Difficulty.hard,
      authorId: 'sample_author',
      categories: ['Mexicana', 'Carnes'],
      createdAt: DateTime.now(),
      servings: 4,
    ),
    Recipe(
      id: '3',
      name: 'Ensalada César',
      description: 'Clásica ensalada con aderezo César, crutones y pollo',
      ingredients: [
        Ingredient(name: 'Lechuga romana', quantity: 1, unit: 'unidad'),
        Ingredient(name: 'Pollo', quantity: 200, unit: 'g'),
        Ingredient(name: 'Pan para crutones', quantity: 100, unit: 'g'),
        Ingredient(name: 'Queso parmesano', quantity: 50, unit: 'g'),
      ],
      steps: [
        'Preparar los crutones con pan y aceite',
        'Cocinar el pollo y cortarlo en tiras',
        'Lavar y cortar la lechuga',
        'Mezclar con el aderezo César',
        'Agregar crutones y queso al servir',
      ],
      imageUrl:
          'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=800',
      preparationTime: 20,
      difficulty: Difficulty.easy,
      authorId: 'sample_author',
      categories: ['Ensaladas', 'Saludable'],
      createdAt: DateTime.now(),
      servings: 2,
    ),
    Recipe(
      id: '4',
      name: 'Sushi Roll California',
      description: 'Roll de sushi con pepino, aguacate y cangrejo',
      ingredients: [
        Ingredient(name: 'Arroz para sushi', quantity: 300, unit: 'g'),
        Ingredient(name: 'Alga nori', quantity: 2, unit: 'hojas'),
        Ingredient(name: 'Pepino', quantity: 1, unit: 'unidad'),
        Ingredient(name: 'Aguacate', quantity: 1, unit: 'unidad'),
        Ingredient(name: 'Cangrejo', quantity: 200, unit: 'g'),
      ],
      steps: [
        'Preparar el arroz para sushi',
        'Cortar los vegetales en tiras',
        'Armar el roll con el alga nori',
        'Enrollar con la esterilla',
        'Cortar en porciones iguales',
      ],
      imageUrl:
          'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=800',
      preparationTime: 45,
      difficulty: Difficulty.medium,
      authorId: 'sample_author',
      categories: ['Japonesa', 'Mariscos'],
      createdAt: DateTime.now(),
      servings: 2,
    ),
  ];
}
