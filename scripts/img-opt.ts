import { mkdirSync, statSync } from 'fs';
import { dirname } from 'path';

import fg from 'fast-glob';
import minimist from 'minimist';
import sharp from 'sharp';

interface Args {
  src: string;
  out: string;
  pattern: string;
  jpgQuality: number;
  pngCompression: number;
  webpQuality: number;
  avifQuality: number;
  avifEffort: number;
  jxlQuality: number;
  jxlEffort: number;
  maxWidth: number;
  verbose: boolean;
  force: boolean;
  skipOriginal: boolean;
  formats: string[];
}

const argv = minimist<Args>(process.argv.slice(2), {
  string: ['src', 'out', 'pattern', 'formats'],
  boolean: ['verbose', 'force', 'skipOriginal'],
  default: {
    src: 'src/presentation/assets/images',
    out: 'public/assets/images',
    // Patrón expandido con todos los formatos soportados por Sharp
    pattern:
      '**/*.{png,jpg,jpeg,webp,heic,heif,avif,tiff,tif,gif,svg,bmp,dng,cr2,nef,arw,rw2,raf,orf,pef,srw,x3f,jxl}',
    // 🎨 CONFIGURACIÓN DE CALIDAD
    jpgQuality: 90, // JPEG: 90% (máxima calidad para web)
    pngCompression: 6, // PNG: nivel 6 (balance perfecto)
    webpQuality: 85, // WebP: 85% (calidad premium)
    avifQuality: 70, // AVIF: 70% (equivale a JPEG 90%)
    avifEffort: 4,
    jxlQuality: 80, // JPEG XL: 80% (si está disponible)
    jxlEffort: 7,
    maxWidth: 1920, // Redimensiona automáticamente imágenes muy grandes
    verbose: true,
    force: false,
    skipOriginal: false,
    formats: ['png', 'jpg', 'webp', 'avif'] // Genera todos los formatos principales
  }
}) as Args;

const SRC_DIR = argv.src.replace(/[\\/]+$/, '');
const OUT_DIR = argv.out.replace(/[\\/]+$/, '');

// Formatos soportados por Sharp
const SUPPORTED_FORMATS = {
  input: [
    'jpeg',
    'jpg',
    'png',
    'webp',
    'gif',
    'avif',
    'heif',
    'heic',
    'tiff',
    'tif',
    'dng',
    'bmp',
    'svg',
    // Formatos RAW
    'cr2',
    'nef',
    'arw',
    'rw2',
    'raf',
    'orf',
    'pef',
    'srw',
    'x3f',
    // JPEG XL (si está disponible)
    'jxl'
  ],
  output: ['jpeg', 'png', 'webp', 'avif', 'tiff', 'heif', 'jxl']
};

function relFromSrc(absPath: string): string {
  return absPath.replace(new RegExp(`^${SRC_DIR}/`), '');
}

function outPathFor(relPath: string): string {
  return `${OUT_DIR}/${relPath}`;
}

function swapExt(p: string, newExt: string): string {
  return p.replace(/\.\w+$/i, `.${newExt}`);
}

function getOriginalFormat(filePath: string): string {
  const ext = filePath.split('.').pop()?.toLowerCase();

  if (ext === 'jpg') return 'jpeg';

  return ext || 'jpeg';
}

function isNewer(src: string, dest: string): boolean {
  try {
    const s = statSync(src);
    const d = statSync(dest);

    return s.mtimeMs > d.mtimeMs;
  } catch {
    return true; // si dest no existe
  }
}

function shouldSkipFormat(format: string, originalFormat: string): boolean {
  // SVG no se debe convertir a otros formatos rasterizados
  if (originalFormat === 'svg' && format !== 'svg') return true;

  return false;
}

async function processOne(file: string) {
  const rel = relFromSrc(file);
  const originalFormat = getOriginalFormat(file);

  // Verificar si el formato es soportado
  if (!SUPPORTED_FORMATS.input.includes(originalFormat)) {
    if (argv.verbose) console.log('⚠ formato no soportado', rel);

    return;
  }

  const destOriginal = outPathFor(rel);
  const outputFormats = argv.formats || ['png', 'jpg', 'webp', 'avif'];
  const destinations = new Map<string, string>();

  // Siempre generar una versión optimizada del original
  destinations.set('original', destOriginal);

  // Generar todos los formatos solicitados
  for (const format of outputFormats) {
    if (shouldSkipFormat(format, originalFormat)) continue;
    const dest = swapExt(destOriginal, format);

    destinations.set(format, dest);
  }

  // Verificar si necesita procesamiento (solo si no es forzado)
  if (!argv.force) {
    const needsUpdate = Array.from(destinations.values()).some(dest =>
      isNewer(file, dest)
    );

    if (!needsUpdate) {
      if (argv.verbose) console.log('↷ skip', rel, '(sin cambios)');

      return;
    }
  }

  try {
    // Manejar SVG de manera especial
    if (originalFormat === 'svg') {
      mkdirSync(dirname(destOriginal), { recursive: true });
      // Para SVG, solo copiamos el archivo original
      const fs = await import('fs/promises');

      await fs.copyFile(file, destOriginal);
      if (argv.verbose) console.log('✓', rel, '[svg copiado]');

      return;
    }

    let img = sharp(file, {
      failOn: 'none',
      unlimited: true, // Para imágenes muy grandes
      sequentialRead: true // Para archivos RAW
    });

    const meta = await img.metadata();
    const shouldResize =
      argv.maxWidth > 0 && meta.width && meta.width > argv.maxWidth;

    if (shouldResize) {
      img = img.resize({
        width: argv.maxWidth,
        withoutEnlargement: true,
        fastShrinkOnLoad: false
      });
    }

    // Crear directorio de salida
    mkdirSync(dirname(destOriginal), { recursive: true });

    const processedFormats: string[] = [];

    // Procesar cada formato de salida
    for (const [formatKey, destination] of destinations) {
      const imgClone = img.clone();

      try {
        if (formatKey === 'original') {
          // Mantener formato original con optimizaciones
          if (['png'].includes(originalFormat)) {
            await imgClone
              .png({
                compressionLevel: argv.pngCompression,
                palette: true,
                effort: 10
              })
              .toFile(destination);
          } else if (['jpeg', 'jpg'].includes(originalFormat)) {
            await imgClone
              .jpeg({
                quality: argv.jpgQuality,
                mozjpeg: true,
                progressive: true
              })
              .toFile(destination);
          } else if (originalFormat === 'webp') {
            await imgClone
              .webp({
                quality: argv.webpQuality,
                effort: 6
              })
              .toFile(destination);
          } else if (originalFormat === 'avif') {
            await imgClone
              .avif({
                quality: argv.avifQuality,
                effort: argv.avifEffort
              })
              .toFile(destination);
          } else {
            // Para otros formatos, convertir a JPEG por defecto
            await imgClone
              .jpeg({
                quality: argv.jpgQuality,
                mozjpeg: true
              })
              .toFile(swapExt(destination, 'jpg'));
          }
          processedFormats.push('orig');
        } else {
          // Procesar formatos de conversión
          switch (formatKey) {
            case 'png':
              await imgClone
                .png({
                  compressionLevel: argv.pngCompression,
                  palette: true,
                  effort: 10
                })
                .toFile(destination);
              processedFormats.push('png');
              break;

            case 'jpeg':
            case 'jpg':
              await imgClone
                .jpeg({
                  quality: argv.jpgQuality,
                  mozjpeg: true,
                  progressive: true
                })
                .toFile(destination);
              processedFormats.push('jpg');
              break;

            case 'webp':
              await imgClone
                .webp({
                  quality: argv.webpQuality,
                  effort: 6,
                  smartSubsample: true
                })
                .toFile(destination);
              processedFormats.push('webp');
              break;

            case 'avif':
              await imgClone
                .avif({
                  quality: argv.avifQuality,
                  effort: argv.avifEffort,
                  chromaSubsampling: '4:2:0'
                })
                .toFile(destination);
              processedFormats.push('avif');
              break;

            case 'jxl':
              // JPEG XL (si está disponible)
              try {
                await imgClone
                  .jxl({
                    quality: argv.jxlQuality,
                    effort: argv.jxlEffort,
                    lossless: false
                  })
                  .toFile(destination);
                processedFormats.push('jxl');
              } catch (err) {
                if (argv.verbose) console.log('⚠ JXL no disponible para', rel);
              }
              break;

            case 'heif':
              await imgClone
                .heif({
                  quality: argv.avifQuality,
                  compression: 'av1'
                })
                .toFile(destination);
              processedFormats.push('heif');
              break;

            case 'tiff':
              await imgClone
                .tiff({
                  compression: 'lzw',
                  quality: 90
                })
                .toFile(destination);
              processedFormats.push('tiff');
              break;

            default:
              if (argv.verbose)
                console.log('⚠ formato desconocido:', formatKey);
          }
        }
      } catch (formatError: any) {
        if (argv.verbose) {
          console.log(
            `⚠ error en formato ${formatKey} para ${rel}: ${formatError.message}`
          );
        }
      }
    }

    if (argv.verbose && processedFormats.length > 0) {
      const parts: string[] = [];

      if (shouldResize) parts.push(`resize→${argv.maxWidth}px`);
      parts.push(...processedFormats);
      console.log('✓', rel, `[${parts.join(', ')}]`);
    }
  } catch (err: any) {
    console.error('✗ error procesando', rel, '-', err?.message || err);
  }
}

async function main() {
  const pattern = `${SRC_DIR}/${argv.pattern}`;
  const files = await fg(pattern, { dot: false });

  if (!files.length) {
    console.log(`(sin archivos) patrón: ${pattern}`);

    return;
  }

  console.log(`🚀 Procesando ${files.length} archivo(s)`);
  console.log(`📁 Desde: "${SRC_DIR}"`);
  console.log(`📁 Hacia: "${OUT_DIR}"`);
  console.log(
    `🎯 Formatos: ${argv.formats?.join(', ') || 'png, jpg, webp, avif'}`
  );
  console.log(
    `📐 Tamaño máximo: ${argv.maxWidth > 0 ? argv.maxWidth + 'px' : 'original'}`
  );
  console.log('─'.repeat(50));

  const startTime = Date.now();
  let processed = 0;

  for (const f of files) {
    try {
      await processOne(f);
      processed++;
    } catch (err: any) {
      console.error('✗ error', relFromSrc(f), '-', err?.message || err);
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log('─'.repeat(50));
  console.log(
    `✅ ¡Completado! ${processed}/${files.length} archivos procesados en ${elapsed}s`
  );

  if (processed < files.length) {
    console.log(
      `⚠️  ${files.length - processed} archivos omitidos (sin cambios o errores)`
    );
  }
}

main().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});
