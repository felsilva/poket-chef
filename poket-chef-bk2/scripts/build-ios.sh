#!/bin/bash

# Crear el directorio de build si no existe
mkdir -p build/ios

# Compilar los archivos Objective-C
clang -c src/ios/poket-chef/*.m \
  -fobjc-arc \
  -isysroot $(xcrun --sdk iphonesimulator --show-sdk-path) \
  -I$(pwd)/src/ios \
  -framework UIKit \
  -framework AVFoundation \
  -framework Foundation \
  -o build/ios/poket-chef.o

# Compilar los archivos Swift
swiftc src/ios/*.swift \
  -import-objc-header src/ios/poket-chef-Bridging-Header.h \
  -emit-objc-header-path build/ios/poket-chef-Swift.h \
  -sdk $(xcrun --sdk iphonesimulator --show-sdk-path) \
  -target x86_64-apple-ios14.0-simulator \
  -o build/ios/NativeCameraScanner

# Crear el framework
mkdir -p build/ios/PoketChef.framework/Headers
cp build/ios/poket-chef-Swift.h build/ios/PoketChef.framework/Headers/
cp src/ios/poket-chef-Bridging-Header.h build/ios/PoketChef.framework/Headers/
cp build/ios/NativeCameraScanner build/ios/PoketChef.framework/
cp build/ios/poket-chef.o build/ios/PoketChef.framework/ 