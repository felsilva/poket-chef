import 'package:cloud_firestore/cloud_firestore.dart';

class User {
  final String id;
  final String email;
  final String name;
  final String? photoUrl;
  final DateTime createdAt;
  final List<String> favoriteRecipes;
  final List<String> createdRecipes;

  User({
    required this.id,
    required this.email,
    required this.name,
    this.photoUrl,
    required this.createdAt,
    List<String>? favoriteRecipes,
    List<String>? createdRecipes,
  }) : 
    favoriteRecipes = favoriteRecipes ?? [],
    createdRecipes = createdRecipes ?? [];

  factory User.fromMap(Map<String, dynamic> map, String id) {
    return User(
      id: id,
      email: map['email'] as String,
      name: map['name'] as String? ?? 'Usuario',
      photoUrl: map['photoUrl'] as String?,
      createdAt: (map['createdAt'] as Timestamp?)?.toDate() ?? DateTime.now(),
      favoriteRecipes: List<String>.from(map['favoriteRecipes'] ?? []),
      createdRecipes: List<String>.from(map['createdRecipes'] ?? []),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'email': email,
      'name': name,
      'photoUrl': photoUrl,
      'createdAt': Timestamp.fromDate(createdAt),
      'favoriteRecipes': favoriteRecipes,
      'createdRecipes': createdRecipes,
    };
  }

  User copyWith({
    String? id,
    String? email,
    String? name,
    String? photoUrl,
    DateTime? createdAt,
    List<String>? favoriteRecipes,
    List<String>? createdRecipes,
  }) {
    return User(
      id: id ?? this.id,
      email: email ?? this.email,
      name: name ?? this.name,
      photoUrl: photoUrl ?? this.photoUrl,
      createdAt: createdAt ?? this.createdAt,
      favoriteRecipes: favoriteRecipes ?? this.favoriteRecipes,
      createdRecipes: createdRecipes ?? this.createdRecipes,
    );
  }
}
