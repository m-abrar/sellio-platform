<?php echo '<?xml version="1.0" encoding="UTF-8"?>'; ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
@foreach($urls as $entry)
    <url>
        <loc>{{ $entry['loc'] }}</loc>
        @if($entry['mod'])
        <lastmod>{{ \Carbon\Carbon::parse($entry['mod'])->toAtomString() }}</lastmod>
        @endif
        <changefreq>{{ $entry['freq'] }}</changefreq>
        <priority>{{ $entry['priority'] }}</priority>
    </url>
@endforeach
</urlset>
