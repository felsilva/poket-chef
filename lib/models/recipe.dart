enum Difficulty { easy, medium, hard }

class Recipe {
  final String id;
  final String name;
  final String description;
  final List<Ingredient> ingredients;
  final List<String> steps;
  final String imageUrl;
  final int preparationTime;
  final Difficulty difficulty;
  final String authorId;
  final List<String> categories;
  final DateTime createdAt;
  final int servings;
  final List<String> likes;

  Recipe({
    required this.id,
    required this.name,
    required this.description,
    required this.ingredients,
    required this.steps,
    required this.imageUrl,
    required this.preparationTime,
    required this.difficulty,
    required this.authorId,
    required this.categories,
    required this.createdAt,
    required this.servings,
    this.likes = const [],
  });
}

class Ingredient {
  final String name;
  final double quantity;
  final String unit;

  Ingredient({
    required this.name,
    required this.quantity,
    required this.unit,
  });
}
