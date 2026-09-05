#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ANDROID_DIR="$ROOT/android"
BUILD_DIR="$ROOT/build/android"
PROPS_FILE="$ANDROID_DIR/keystore.properties"
BUNDLE_SRC="$ANDROID_DIR/app/build/outputs/bundle/release/app-release.aab"
MAPPING_SRC="$ANDROID_DIR/app/build/outputs/mapping/release/mapping.txt"
BUNDLE_OUT="$BUILD_DIR/Almaniac-1.0.14-signed.aab"
MAPPING_OUT="$BUILD_DIR/Almaniac-1.0.14-mapping.txt"

export JAVA_HOME="${JAVA_HOME:-/Library/Java/JavaVirtualMachines/jdk-21.jdk/Contents/Home}"

if [[ ! -f "$PROPS_FILE" ]]; then
  echo "Missing $PROPS_FILE — create an upload keystore first." >&2
  exit 1
fi

store_file="$(grep '^storeFile=' "$PROPS_FILE" | cut -d= -f2-)"
store_password="$(grep '^storePassword=' "$PROPS_FILE" | cut -d= -f2-)"
key_alias="$(grep '^keyAlias=' "$PROPS_FILE" | cut -d= -f2-)"
key_password="$(grep '^keyPassword=' "$PROPS_FILE" | cut -d= -f2-)"
keystore_path="$ANDROID_DIR/app/$store_file"

cd "$ROOT"
npm run build
npx cap sync android

cd "$ANDROID_DIR"
./gradlew :app:bundleRelease

mkdir -p "$BUILD_DIR"
rm -f "$BUNDLE_OUT"
cp "$BUNDLE_SRC" "$BUNDLE_OUT"

# Re-sign with explicit SHA-256 JAR signing for Play Console upload.
zip -d "$BUNDLE_OUT" 'META-INF/*.SF' 'META-INF/*.RSA' 'META-INF/*.DSA' 'META-INF/*.EC' 'META-INF/MANIFEST.MF' >/dev/null 2>&1 || true

"$JAVA_HOME/bin/jarsigner" \
  -verbose \
  -sigalg SHA256withRSA \
  -digestalg SHA-256 \
  -keystore "$keystore_path" \
  -storepass "$store_password" \
  -keypass "$key_password" \
  "$BUNDLE_OUT" \
  "$key_alias"

"$JAVA_HOME/bin/jarsigner" -verify "$BUNDLE_OUT"

if ! unzip -l "$BUNDLE_OUT" | grep -q 'META-INF/.*\.\(RSA\|DSA\|EC\)'; then
  echo "Bundle is missing a JAR signature." >&2
  exit 1
fi

cp "$BUNDLE_OUT" "$BUILD_DIR/Almaniac-1.0.14-release.aab"

if [[ -f "$MAPPING_SRC" ]]; then
  cp "$MAPPING_SRC" "$MAPPING_OUT"
  mkdir -p "$ROOT/store/google-play"
  cp "$MAPPING_OUT" "$ROOT/store/google-play/Almaniac-1.0.14-mapping.txt"
else
  echo "Warning: mapping.txt not found at $MAPPING_SRC" >&2
fi

mkdir -p "$ROOT/store/google-play"
cp "$BUILD_DIR/Almaniac-1.0.14-release.aab" "$ROOT/store/google-play/Almaniac-1.0.14.aab"

echo ""
echo "Signed bundle ready for Play Console:"
echo "  $BUNDLE_OUT"
if [[ -f "$MAPPING_OUT" ]]; then
  echo "Deobfuscation mapping file:"
  echo "  $MAPPING_OUT"
fi
shasum -a 256 "$BUNDLE_OUT"
if [[ -f "$MAPPING_OUT" ]]; then
  shasum -a 256 "$MAPPING_OUT"
fi
