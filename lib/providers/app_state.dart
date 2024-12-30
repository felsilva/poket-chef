import 'package:flutter/foundation.dart';
import '../models/user.dart';
import '../models/recipe.dart';
import '../services/firebase_service.dart';

class AppState with ChangeNotifier {
  final FirebaseService _firebaseService = FirebaseService();
  User? _currentUser;
  List<Recipe> _recipes = [];
  bool _isLoading = false;

  User? get currentUser => _currentUser;
  List<Recipe> get recipes => _recipes;
  bool get isLoading => _isLoading;

  void setCurrentUser(User? user) {
    if (_currentUser?.id != user?.id) {
      _currentUser = user;
      notifyListeners();
    }
  }

  void setLoading(bool value) {
    if (_isLoading != value) {
      _isLoading = value;
      notifyListeners();
    }
  }

  void setRecipes(List<Recipe> recipes) {
    _recipes = recipes;
    notifyListeners();
  }

  Future<void> loadRecipes() async {
    try {
      setLoading(true);
      final recipes = await _firebaseService.getRecipes();
      setRecipes(recipes);
    } catch (e) {
      debugPrint('Error loading recipes: $e');
      rethrow;
    } finally {
      setLoading(false);
    }
  }
}
