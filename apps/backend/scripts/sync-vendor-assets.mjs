import { cp, mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const backendRoot = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const repoRoot = join(backendRoot, '..', '..');
const vendorRoot = join(backendRoot, 'public', 'vendor', 'npm');

/** @type {Array<[string, string]>} */
const copies = [
    ['node_modules/bootstrap/dist/css/bootstrap.min.css', 'bootstrap/css/bootstrap.min.css'],
    ['node_modules/bootstrap/dist/css/bootstrap.min.css.map', 'bootstrap/css/bootstrap.min.css.map'],
    ['node_modules/bootstrap/dist/js/bootstrap.bundle.min.js', 'bootstrap/js/bootstrap.bundle.min.js'],
    ['node_modules/bootstrap/dist/js/bootstrap.bundle.min.js.map', 'bootstrap/js/bootstrap.bundle.min.js.map'],
    ['node_modules/bootstrap-icons/font/bootstrap-icons.css', 'bootstrap-icons/bootstrap-icons.css'],
    ['node_modules/bootstrap-icons/font/fonts', 'bootstrap-icons/fonts'],
    ['node_modules/sweetalert2/dist/sweetalert2.all.min.js', 'sweetalert2/sweetalert2.all.min.js'],
    ['node_modules/flatpickr/dist/flatpickr.min.css', 'flatpickr/flatpickr.min.css'],
    ['node_modules/flatpickr/dist/flatpickr.min.js', 'flatpickr/flatpickr.min.js'],
    ['node_modules/chart.js/dist/chart.umd.min.js', 'chart.js/chart.umd.min.js'],
    ['node_modules/fullcalendar/index.global.min.js', 'fullcalendar/index.global.min.js'],
    ['node_modules/leaflet/dist/leaflet.css', 'leaflet/leaflet.css'],
    ['node_modules/leaflet/dist/leaflet.js', 'leaflet/leaflet.js'],
    ['node_modules/leaflet/dist/images', 'leaflet/images'],
    ['node_modules/leaflet.heat/dist/leaflet-heat.js', 'leaflet.heat/leaflet-heat.js'],
    ['node_modules/animate.css/animate.min.css', 'animate.css/animate.min.css'],
    ['node_modules/nestable2/dist/jquery.nestable.min.css', 'nestable2/jquery.nestable.min.css'],
    ['node_modules/nestable2/dist/jquery.nestable.min.js', 'nestable2/jquery.nestable.min.js'],
    ['node_modules/flag-icon-css/css/flag-icons.min.css', 'flag-icon-css/flag-icons.min.css'],
    ['node_modules/flag-icon-css/flags', 'flag-icon-css/flags'],
    ['node_modules/grapesjs/dist/css/grapes.min.css', 'grapesjs/grapes.min.css'],
    ['node_modules/grapesjs/dist/grapes.min.js', 'grapesjs/grapes.min.js'],
    ['node_modules/grapesjs-blocks-basic/dist/index.js', 'grapesjs-blocks-basic/index.js'],
    ['node_modules/@fortawesome/fontawesome-free/css/all.min.css', 'fontawesome/css/all.min.css'],
    ['node_modules/@fortawesome/fontawesome-free/webfonts', 'fontawesome/webfonts'],
    ['node_modules/datatables.net/js/dataTables.min.js', 'datatables/jquery.dataTables.min.js'],
    ['node_modules/datatables.net-bs4/js/dataTables.bootstrap4.min.js', 'datatables/dataTables.bootstrap4.min.js'],
    ['node_modules/datatables.net-bs4/css/dataTables.bootstrap4.min.css', 'datatables/dataTables.bootstrap4.min.css'],
    ['node_modules/select2/dist/js/select2.min.js', 'select2/select2.min.js'],
    ['node_modules/select2/dist/css/select2.min.css', 'select2/select2.min.css'],
    ['node_modules/pace-js/pace-theme-default.min.css', 'pace/pace-theme-default.min.css'],
    ['node_modules/pace-js/pace.min.js', 'pace/pace.min.js'],
    ['node_modules/@fontsource/inter/300.css', 'fontsource/inter-300.css'],
    ['node_modules/@fontsource/inter/400.css', 'fontsource/inter-400.css'],
    ['node_modules/@fontsource/inter/500.css', 'fontsource/inter-500.css'],
    ['node_modules/@fontsource/inter/600.css', 'fontsource/inter-600.css'],
    ['node_modules/@fontsource/inter/700.css', 'fontsource/inter-700.css'],
    ['node_modules/@fontsource/inter/800.css', 'fontsource/inter-800.css'],
    ['node_modules/@fontsource/outfit/400.css', 'fontsource/outfit-400.css'],
    ['node_modules/@fontsource/outfit/500.css', 'fontsource/outfit-500.css'],
    ['node_modules/@fontsource/outfit/600.css', 'fontsource/outfit-600.css'],
    ['node_modules/@fontsource/outfit/700.css', 'fontsource/outfit-700.css'],
    ['node_modules/@fontsource/outfit/800.css', 'fontsource/outfit-800.css'],
    ['node_modules/@fontsource/plus-jakarta-sans/400.css', 'fontsource/plus-jakarta-sans-400.css'],
    ['node_modules/@fontsource/plus-jakarta-sans/600.css', 'fontsource/plus-jakarta-sans-600.css'],
    ['node_modules/@fontsource/plus-jakarta-sans/800.css', 'fontsource/plus-jakarta-sans-800.css'],
    ['node_modules/@fontsource/inter/files', 'fontsource/files/inter'],
    ['node_modules/@fontsource/outfit/files', 'fontsource/files/outfit'],
    ['node_modules/@fontsource/plus-jakarta-sans/files', 'fontsource/files/plus-jakarta-sans'],
];

async function copyPair(sourceRelative, targetRelative) {
    const source = join(backendRoot, sourceRelative);
    const target = join(vendorRoot, targetRelative);
    await mkdir(dirname(target), { recursive: true });
    await cp(source, target, { recursive: true, force: true });
}

async function patchFontsourceCss(relativePath, filesSubdir) {
    const filePath = join(vendorRoot, relativePath);
    const { readFile } = await import('node:fs/promises');
    let css = await readFile(filePath, 'utf8');
    css = css.replaceAll('../files/', `/vendor/npm/fontsource/files/${filesSubdir}/`);
    await writeFile(filePath, css);
}

async function syncBundle() {
    await mkdir(vendorRoot, { recursive: true });

    for (const [source, target] of copies) {
        await copyPair(source, target);
        console.log(`Copied ${target}`);
    }

    await writeFile(
        join(vendorRoot, 'fontsource', 'bundle.css'),
        [
            "@import url('/vendor/npm/fontsource/inter-300.css');",
            "@import url('/vendor/npm/fontsource/inter-400.css');",
            "@import url('/vendor/npm/fontsource/inter-500.css');",
            "@import url('/vendor/npm/fontsource/inter-600.css');",
            "@import url('/vendor/npm/fontsource/inter-700.css');",
            "@import url('/vendor/npm/fontsource/inter-800.css');",
            "@import url('/vendor/npm/fontsource/outfit-400.css');",
            "@import url('/vendor/npm/fontsource/outfit-500.css');",
            "@import url('/vendor/npm/fontsource/outfit-600.css');",
            "@import url('/vendor/npm/fontsource/outfit-700.css');",
            "@import url('/vendor/npm/fontsource/outfit-800.css');",
        ].join('\n'),
        'utf8'
    );

    for (const [file, subdir] of [
        ['fontsource/inter-300.css', 'inter'],
        ['fontsource/inter-400.css', 'inter'],
        ['fontsource/inter-500.css', 'inter'],
        ['fontsource/inter-600.css', 'inter'],
        ['fontsource/inter-700.css', 'inter'],
        ['fontsource/inter-800.css', 'inter'],
        ['fontsource/outfit-400.css', 'outfit'],
        ['fontsource/outfit-500.css', 'outfit'],
        ['fontsource/outfit-600.css', 'outfit'],
        ['fontsource/outfit-700.css', 'outfit'],
        ['fontsource/outfit-800.css', 'outfit'],
        ['fontsource/plus-jakarta-sans-400.css', 'plus-jakarta-sans'],
        ['fontsource/plus-jakarta-sans-600.css', 'plus-jakarta-sans'],
        ['fontsource/plus-jakarta-sans-800.css', 'plus-jakarta-sans'],
    ]) {
        await patchFontsourceCss(file, subdir);
    }

    const introVendor = join(repoRoot, 'Introduction', 'assets', 'vendor');
    const docVendor = join(repoRoot, 'Documentation', 'assets', 'vendor');
    const introCopies = [
        ['bootstrap/css/bootstrap.min.css', 'bootstrap/css/bootstrap.min.css'],
        ['bootstrap/js/bootstrap.bundle.min.js', 'bootstrap/js/bootstrap.bundle.min.js'],
        ['fontawesome/css/all.min.css', 'fontawesome/css/all.min.css'],
        ['fontawesome/webfonts', 'fontawesome/webfonts'],
        ['animate.css/animate.min.css', 'animate.css/animate.min.css'],
        ['fontsource/bundle.css', 'fontsource/bundle.css'],
        ['fontsource/inter-400.css', 'fontsource/inter-400.css'],
        ['fontsource/inter-600.css', 'fontsource/inter-600.css'],
        ['fontsource/inter-800.css', 'fontsource/inter-800.css'],
        ['fontsource/files/inter', 'fontsource/files/inter'],
    ];

    for (const targetRoot of [introVendor, docVendor]) {
        await mkdir(targetRoot, { recursive: true });
        for (const [, target] of introCopies) {
            const source = join(vendorRoot, target);
            const dest = join(targetRoot, target);
            await mkdir(dirname(dest), { recursive: true });
            await cp(source, dest, { recursive: true, force: true });
        }
    }

    console.log('Vendor assets synced to public/vendor/npm');
}

syncBundle().catch((error) => {
    console.error(error);
    process.exit(1);
});
