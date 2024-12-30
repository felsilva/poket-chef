import 'package:flutter/material.dart';

class Tw {
  // Colores principales de Poket Chef
  static final primary = Color(0xFFFF6B6B); // Rojo coral
  static final secondary = Color(0xFF4ECDC4); // Turquesa
  static final accent = Color(0xFFFFBE0B); // Amarillo
  static final dark = Color(0xFF2C363F); // Gris oscuro
  static final light = Color(0xFFF7F7F7); // Gris claro
  static final white = Colors.white;
  static final error = Color(0xFFFF4646); // Rojo error

  // Gradientes
  static final primaryGradient = LinearGradient(
    colors: [primary, primary.withOpacity(0.8)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  // Espaciado
  static const spacing1 = 4.0;
  static const spacing2 = 8.0;
  static const spacing3 = 12.0;
  static const spacing4 = 16.0;
  static const spacing6 = 24.0;
  static const spacing8 = 32.0;

  // Padding
  static final p1 = EdgeInsets.all(spacing1);
  static final p2 = EdgeInsets.all(spacing2);
  static final p3 = EdgeInsets.all(spacing3);
  static final p4 = EdgeInsets.all(spacing4);
  static final p6 = EdgeInsets.all(spacing6);
  static final p8 = EdgeInsets.all(spacing8);

  // Bordes redondeados
  static final roundedSm = BorderRadius.circular(4);
  static final roundedMd = BorderRadius.circular(8);
  static final roundedLg = BorderRadius.circular(12);
  static final roundedXl = BorderRadius.circular(16);
  static final roundedFull = BorderRadius.circular(999);

  // Estilos de texto
  static final textSm = TextStyle(
    fontSize: 14,
    color: dark,
    fontWeight: FontWeight.normal,
  );

  static final textBase = TextStyle(
    fontSize: 16,
    color: dark,
    fontWeight: FontWeight.normal,
  );

  static final textLg = TextStyle(
    fontSize: 18,
    color: dark,
    fontWeight: FontWeight.bold,
  );

  static final textXl = TextStyle(
    fontSize: 20,
    color: dark,
    fontWeight: FontWeight.bold,
  );

  static final heading = TextStyle(
    fontSize: 24,
    color: dark,
    fontWeight: FontWeight.bold,
  );

  // Sombras
  static final shadowSm = BoxShadow(
    color: Colors.black.withOpacity(0.05),
    blurRadius: 4,
    offset: const Offset(0, 2),
  );

  static final shadow = BoxShadow(
    color: Colors.black.withOpacity(0.1),
    blurRadius: 8,
    offset: const Offset(0, 4),
  );
}
