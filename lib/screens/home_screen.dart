import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_state.dart';
import '../models/recipe.dart';
import '../styles/tailwind.dart';
import '../widgets/recipe_card.dart';
import '../widgets/category_card.dart';
import '../services/auth_service.dart';
import '../services/firebase_service.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;

  @override
  void initState() {
    super.initState();
    Future.microtask(() => _loadInitialData());
  }

  Future<void> _loadInitialData() async {
    if (!mounted) return;
    await context.read<AppState>().loadRecipes();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Pocket Chef'),
        backgroundColor: Tw.primary,
        foregroundColor: Tw.white,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {
              // TODO: Implementar búsqueda
            },
          ),
          IconButton(
            icon: const Icon(Icons.notifications),
            onPressed: () {
              // TODO: Implementar notificaciones
            },
          ),
        ],
      ),
      body: IndexedStack(
        index: _currentIndex,
        children: [
          _buildHomeTab(),
          _buildSearchTab(),
          _buildCreateRecipeTab(),
          _buildFavoritesTab(),
          _buildProfileTab(),
        ],
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        type: BottomNavigationBarType.fixed,
        selectedItemColor: Tw.primary,
        unselectedItemColor: Colors.grey,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home_outlined),
            activeIcon: Icon(Icons.home),
            label: 'Inicio',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.search_outlined),
            activeIcon: Icon(Icons.search),
            label: 'Explorar',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.add_circle_outline),
            activeIcon: Icon(Icons.add_circle),
            label: 'Crear',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.favorite_border),
            activeIcon: Icon(Icons.favorite),
            label: 'Favoritos',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person_outline),
            activeIcon: Icon(Icons.person),
            label: 'Perfil',
          ),
        ],
      ),
    );
  }

  Widget _buildHomeTab() {
    return Consumer<AppState>(
      builder: (context, appState, child) {
        if (appState.isLoading) {
          return Center(
            child: CircularProgressIndicator(color: Tw.primary),
          );
        }

        return RefreshIndicator(
          onRefresh: _loadInitialData,
          color: Tw.primary,
          child: CustomScrollView(
            slivers: [
              // Categorías
              SliverToBoxAdapter(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Padding(
                      padding: EdgeInsets.only(
                        left: Tw.spacing3,
                        top: Tw.spacing3,
                        bottom: Tw.spacing2,
                      ),
                      child: Text('Categorías', style: Tw.heading),
                    ),
                    SizedBox(
                      height: 120,
                      child: ListView.builder(
                        scrollDirection: Axis.horizontal,
                        padding: EdgeInsets.only(left: Tw.spacing3),
                        itemCount: 5,
                        itemBuilder: (context, index) {
                          final categories = [
                            {
                              'name': 'Italiana',
                              'image':
                                  'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?q=80&w=400'
                            },
                            {
                              'name': 'Mexicana',
                              'image':
                                  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=400'
                            },
                            {
                              'name': 'Saludable',
                              'image':
                                  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400'
                            },
                            {
                              'name': 'Postres',
                              'image':
                                  'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=400'
                            },
                            {
                              'name': 'Bebidas',
                              'image':
                                  'https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=400'
                            },
                          ];
                          return CategoryCard(
                            name: categories[index]['name']!,
                            imageUrl: categories[index]['image']!,
                          );
                        },
                      ),
                    ),
                  ],
                ),
              ),

              // Recetas populares
              SliverToBoxAdapter(
                child: Padding(
                  padding: EdgeInsets.only(
                    left: Tw.spacing3,
                    top: Tw.spacing4,
                    bottom: Tw.spacing2,
                  ),
                  child: Text('Recetas Populares', style: Tw.heading),
                ),
              ),

              // Lista de recetas
              SliverList(
                delegate: SliverChildBuilderDelegate(
                  (context, index) {
                    if (appState.recipes.isEmpty) {
                      return Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.restaurant_menu,
                                size: 64, color: Tw.primary),
                            const SizedBox(height: 16),
                            Text(
                              'No hay recetas disponibles',
                              style: Tw.textLg,
                            ),
                            const SizedBox(height: 8),
                            ElevatedButton(
                              onPressed: () async {
                                try {
                                  await context
                                      .read<FirebaseService>()
                                      .loadSampleData();
                                  await _loadInitialData();
                                } catch (e) {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(content: Text('Error: $e')),
                                  );
                                }
                              },
                              child: const Text('Cargar datos de ejemplo'),
                            ),
                          ],
                        ),
                      );
                    }
                    return RecipeCard(recipe: appState.recipes[index]);
                  },
                  childCount:
                      appState.recipes.isEmpty ? 1 : appState.recipes.length,
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildSearchTab() {
    return Container(
      padding: Tw.p3,
      child: Column(
        children: [
          TextField(
            decoration: InputDecoration(
              hintText: 'Buscar recetas...',
              prefixIcon: const Icon(Icons.search),
              border: OutlineInputBorder(
                borderRadius: Tw.roundedLg,
                borderSide: BorderSide.none,
              ),
              filled: true,
              fillColor: Colors.grey[100],
            ),
          ),
          const SizedBox(height: 16),
          Expanded(
            child: GridView.builder(
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                childAspectRatio: 0.75,
                crossAxisSpacing: 10,
                mainAxisSpacing: 10,
              ),
              itemCount: 0, // TODO: Implementar búsqueda
              itemBuilder: (context, index) {
                return Container(); // TODO: Implementar tarjeta de receta para grid
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCreateRecipeTab() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.add_circle_outline, size: 64, color: Tw.primary),
          const SizedBox(height: 16),
          Text(
            'Crear Nueva Receta',
            style: Tw.heading,
          ),
          const SizedBox(height: 8),
          ElevatedButton(
            onPressed: () {
              Navigator.pushNamed(context, '/create-recipe');
            },
            child: const Text('Comenzar'),
          ),
        ],
      ),
    );
  }

  Widget _buildFavoritesTab() {
    return Consumer<AppState>(
      builder: (context, appState, child) {
        if (appState.currentUser == null) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.favorite_border, size: 64, color: Tw.primary),
                const SizedBox(height: 16),
                Text(
                  'Inicia sesión para ver tus favoritos',
                  style: Tw.textLg,
                ),
                const SizedBox(height: 8),
                ElevatedButton(
                  onPressed: () {
                    Navigator.pushNamed(context, '/login');
                  },
                  child: const Text('Iniciar Sesión'),
                ),
              ],
            ),
          );
        }

        return Center(
          child: Text('Próximamente', style: Tw.textLg),
        );
      },
    );
  }

  Widget _buildProfileTab() {
    return Consumer<AppState>(
      builder: (context, appState, child) {
        if (appState.currentUser == null) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.person_outline, size: 64, color: Tw.primary),
                const SizedBox(height: 16),
                Text(
                  'Inicia sesión para ver tu perfil',
                  style: Tw.textLg,
                ),
                const SizedBox(height: 8),
                ElevatedButton(
                  onPressed: () {
                    Navigator.pushNamed(context, '/login');
                  },
                  child: const Text('Iniciar Sesión'),
                ),
              ],
            ),
          );
        }

        return Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              CircleAvatar(
                radius: 50,
                backgroundColor: Tw.primary,
                child: Icon(Icons.person, size: 50, color: Tw.white),
              ),
              const SizedBox(height: 16),
              Text(
                appState.currentUser?.name ?? 'Usuario',
                style: Tw.heading,
              ),
              const SizedBox(height: 8),
              Text(
                appState.currentUser?.email ?? '',
                style: Tw.textBase,
              ),
              const SizedBox(height: 32),
              ElevatedButton(
                onPressed: () async {
                  await context.read<AuthService>().signOut();
                },
                child: const Text('Cerrar Sesión'),
              ),
            ],
          ),
        );
      },
    );
  }
}
