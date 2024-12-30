import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../models/recipe.dart';
import '../styles/tailwind.dart';

class RecipeCard extends StatelessWidget {
  final Recipe recipe;

  const RecipeCard({super.key, required this.recipe});

  String get optimizedImageUrl {
    return '${recipe.imageUrl}&w=400&q=80&fm=webp';
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: Tw.p2,
      elevation: 2,
      child: Container(
        decoration: BoxDecoration(
          borderRadius: Tw.roundedLg,
          color: Tw.white,
          boxShadow: [Tw.shadowSm],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ClipRRect(
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(12),
                topRight: Radius.circular(12),
              ),
              child: Stack(
                children: [
                  CachedNetworkImage(
                    imageUrl: optimizedImageUrl,
                    height: 200,
                    width: double.infinity,
                    fit: BoxFit.cover,
                    placeholder: (context, url) => Container(
                      color: Tw.light,
                      child: Center(
                        child: CircularProgressIndicator(
                          color: Tw.primary,
                        ),
                      ),
                    ),
                    errorWidget: (context, url, error) => Container(
                      color: Tw.light,
                      height: 200,
                      child: Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.error_outline,
                                color: Tw.error, size: 32),
                            const SizedBox(height: 8),
                            Text(
                              'Error al cargar la imagen',
                              style: TextStyle(color: Tw.error),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  Positioned(
                    top: 8,
                    right: 8,
                    child: Container(
                      padding: Tw.p2,
                      decoration: BoxDecoration(
                        color: Tw.primary.withOpacity(0.9),
                        borderRadius: Tw.roundedFull,
                      ),
                      child: Icon(
                        Icons.favorite_border,
                        color: Tw.white,
                        size: 20,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            Padding(
              padding: Tw.p3,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    recipe.name,
                    style: Tw.textLg,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    recipe.description,
                    style: Tw.textSm,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Icon(Icons.timer, size: 16, color: Tw.secondary),
                      const SizedBox(width: 4),
                      Text(
                        '${recipe.preparationTime} min',
                        style: Tw.textSm,
                      ),
                      const SizedBox(width: 16),
                      Icon(Icons.restaurant_menu,
                          size: 16, color: Tw.secondary),
                      const SizedBox(width: 4),
                      Text(
                        recipe.difficulty.toString().split('.').last,
                        style: Tw.textSm,
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
