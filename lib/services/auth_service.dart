import 'package:firebase_auth/firebase_auth.dart' as firebase_auth;
import '../models/user.dart' as app_user;
import 'firebase_service.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/foundation.dart';

class AuthService {
  final firebase_auth.FirebaseAuth _auth = firebase_auth.FirebaseAuth.instance;
  final FirebaseService _firebaseService = FirebaseService();
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  // Stream para escuchar cambios en el estado de autenticación
  Stream<app_user.User?> get authStateChanges => _auth.authStateChanges().map((firebaseUser) {
        if (firebaseUser == null) return null;
        return app_user.User(
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          name: firebaseUser.displayName ?? 'Usuario',
          photoUrl: firebaseUser.photoURL,
          createdAt: DateTime.now(),
        );
      });

  // Iniciar sesión con correo y contraseña
  Future<app_user.User?> signInWithEmailAndPassword(
    String email,
    String password,
  ) async {
    try {
      final result = await _auth.signInWithEmailAndPassword(
        email: email,
        password: password,
      );

      if (result.user != null) {
        final userDoc = await _firestore
            .collection('users')
            .doc(result.user!.uid)
            .get();

        if (userDoc.exists) {
          return app_user.User.fromMap(userDoc.data()!, result.user!.uid);
        }
      }
      return null;
    } catch (e) {
      debugPrint('Error signing in: $e');
      rethrow;
    }
  }

  // Registrar nuevo usuario
  Future<app_user.User?> registerWithEmailAndPassword(
    String email,
    String password,
    String name,
  ) async {
    try {
      final result = await _auth.createUserWithEmailAndPassword(
        email: email,
        password: password,
      );

      if (result.user != null) {
        // Actualizar el displayName en Firebase Auth
        await result.user!.updateDisplayName(name);

        // Crear el documento del usuario en Firestore
        final user = app_user.User(
          id: result.user!.uid,
          email: email,
          name: name,
          createdAt: DateTime.now(),
          favoriteRecipes: [],
          createdRecipes: [],
        );

        await _firestore
            .collection('users')
            .doc(user.id)
            .set(user.toMap());

        return user;
      }
      return null;
    } catch (e) {
      debugPrint('Error registering: $e');
      rethrow;
    }
  }

  // Cerrar sesión
  Future<void> signOut() async {
    try {
      await _auth.signOut();
    } catch (e) {
      debugPrint('Error signing out: $e');
      rethrow;
    }
  }
}
