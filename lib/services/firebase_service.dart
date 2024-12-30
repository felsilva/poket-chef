import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/recipe.dart';
import '../models/user.dart';
import '../models/category.dart';
import '../utils/sample_data.dart';
import 'package:flutter/foundation.dart';

class FirebaseService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  // Recetas
  Future<List<Recipe>> getRecipes() async {
    try {
      final snapshot = await _firestore.collection('recipes').get();
      return snapshot.docs.map((doc) {
        final data = doc.data();
        return Recipe(
          id: doc.id,
          name: data['name'],
          description: data['description'],
          ingredients: (data['ingredients'] as List)
              .map((i) => Ingredient(
                    name: i['name'],
                    quantity: i['quantity'],
                    unit: i['unit'],
                  ))
              .toList(),
          steps: List<String>.from(data['steps']),
          imageUrl: data['imageUrl'],
          preparationTime: data['preparationTime'],
          difficulty: Difficulty.values
              .firstWhere((d) => d.toString() == data['difficulty']),
          authorId: data['authorId'],
          categories: List<String>.from(data['categories']),
          createdAt: (data['createdAt'] as Timestamp).toDate(),
          servings: data['servings'],
          likes: List<String>.from(data['likes']),
        );
      }).toList();
    } catch (e) {
      print('Error getting recipes: $e');
      return [];
    }
  }

  Future<Recipe?> getRecipeById(String id) async {
    try {
      final doc = await _firestore.collection('recipes').doc(id).get();
      if (!doc.exists) return null;

      final data = doc.data()!;
      return Recipe(
        id: doc.id,
        name: data['name'],
        description: data['description'],
        ingredients: (data['ingredients'] as List)
            .map((i) => Ingredient(
                  name: i['name'],
                  quantity: i['quantity'],
                  unit: i['unit'],
                ))
            .toList(),
        steps: List<String>.from(data['steps']),
        imageUrl: data['imageUrl'],
        preparationTime: data['preparationTime'],
        difficulty: Difficulty.values
            .firstWhere((d) => d.toString() == data['difficulty']),
        authorId: data['authorId'],
        categories: List<String>.from(data['categories']),
        createdAt: (data['createdAt'] as Timestamp).toDate(),
        servings: data['servings'],
        likes: List<String>.from(data['likes']),
      );
    } catch (e) {
      print('Error getting recipe: $e');
      return null;
    }
  }

  Future<void> createRecipe(Recipe recipe) async {
    try {
      await _firestore.collection('recipes').add({
        'name': recipe.name,
        'description': recipe.description,
        'ingredients': recipe.ingredients
            .map((i) => {
                  'name': i.name,
                  'quantity': i.quantity,
                  'unit': i.unit,
                })
            .toList(),
        'steps': recipe.steps,
        'imageUrl': recipe.imageUrl,
        'preparationTime': recipe.preparationTime,
        'difficulty': recipe.difficulty.toString(),
        'authorId': recipe.authorId,
        'categories': recipe.categories,
        'createdAt': Timestamp.fromDate(recipe.createdAt),
        'servings': recipe.servings,
        'likes': recipe.likes,
      });
    } catch (e) {
      print('Error creating recipe: $e');
      rethrow;
    }
  }

  // Usuarios
  Future<User?> getUserProfile(String userId) async {
    try {
      final doc = await _firestore.collection('users').doc(userId).get();
      if (doc.exists) {
        return User.fromMap(doc.data()!, doc.id);
      }
      return null;
    } catch (e) {
      debugPrint('Error getting user profile: $e');
      rethrow;
    }
  }

  Future<void> updateUserProfile(User user) async {
    try {
      await _firestore.collection('users').doc(user.id).update({
        'name': user.name,
        'photoUrl': user.photoUrl,
        'email': user.email,
        'favoriteRecipes': user.favoriteRecipes,
        'createdRecipes': user.createdRecipes,
      });
    } catch (e) {
      debugPrint('Error updating user profile: $e');
      rethrow;
    }
  }

  Future<void> loadSampleData() async {
    try {
      final recipes = getSampleRecipes();
      for (final recipe in recipes) {
        await createRecipe(recipe);
      }
    } catch (e) {
      print('Error loading sample data: $e');
      rethrow;
    }
  }
}
