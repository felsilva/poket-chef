import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:provider/provider.dart';
import 'firebase_options.dart';
import 'providers/app_state.dart';
import 'screens/login_screen.dart';
import 'screens/signup_screen.dart';
import 'screens/home_screen.dart';
import 'services/auth_service.dart';
import 'services/firebase_service.dart';
import 'widgets/auth_wrapper.dart';
import 'styles/tailwind.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        Provider<FirebaseService>(
          create: (_) => FirebaseService(),
          lazy: false,
        ),
        Provider<AuthService>(
          create: (context) => AuthService(),
          lazy: false,
        ),
        ChangeNotifierProxyProvider<AuthService, AppState>(
          create: (_) => AppState(),
          update: (_, auth, state) => state!,
        ),
      ],
      child: MaterialApp(
        title: 'Pocket Chef',
        theme: ThemeData(
          colorScheme: ColorScheme.fromSeed(
            seedColor: Tw.primary,
            primary: Tw.primary,
            secondary: Tw.secondary,
            background: Tw.light,
            surface: Tw.white,
            error: Tw.error,
          ),
          useMaterial3: true,
          appBarTheme: AppBarTheme(
            backgroundColor: Tw.primary,
            foregroundColor: Tw.white,
            elevation: 0,
          ),
          floatingActionButtonTheme: FloatingActionButtonThemeData(
            backgroundColor: Tw.primary,
            foregroundColor: Tw.white,
          ),
          cardTheme: CardTheme(
            elevation: 2,
            shape: RoundedRectangleBorder(borderRadius: Tw.roundedLg),
            color: Tw.white,
          ),
          inputDecorationTheme: InputDecorationTheme(
            filled: true,
            fillColor: Tw.white,
            border: OutlineInputBorder(
              borderRadius: Tw.roundedMd,
              borderSide: BorderSide(color: Tw.primary),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: Tw.roundedMd,
              borderSide: BorderSide(color: Tw.primary.withOpacity(0.3)),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: Tw.roundedMd,
              borderSide: BorderSide(color: Tw.primary),
            ),
          ),
        ),
        home: const AuthWrapper(),
        routes: {
          '/login': (context) => const LoginScreen(),
          '/signup': (context) => const SignUpScreen(),
          '/home': (context) => const HomeScreen(),
        },
      ),
    );
  }
}
