import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../styles/tailwind.dart';

class CategoryCard extends StatelessWidget {
  final String name;
  final String imageUrl;

  const CategoryCard({
    super.key,
    required this.name,
    required this.imageUrl,
  });

  String get optimizedImageUrl {
    // Agregamos parámetros de Unsplash para optimizar la imagen
    return '$imageUrl&w=200&q=80&fm=webp';
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 100,
      margin: EdgeInsets.only(left: Tw.spacing2),
      child: Column(
        children: [
          Container(
            height: 80,
            decoration: BoxDecoration(
              borderRadius: Tw.roundedLg,
            ),
            child: ClipRRect(
              borderRadius: Tw.roundedLg,
              child: CachedNetworkImage(
                imageUrl: optimizedImageUrl,
                fit: BoxFit.cover,
                placeholder: (context, url) => Container(
                  color: Colors.grey[300],
                  child: const Center(
                    child: CircularProgressIndicator(),
                  ),
                ),
                errorWidget: (context, url, error) => Container(
                  color: Colors.grey[300],
                  child: const Icon(Icons.error),
                ),
              ),
            ),
          ),
          const SizedBox(height: 4),
          Text(
            name,
            style: Tw.textSm,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }
}
