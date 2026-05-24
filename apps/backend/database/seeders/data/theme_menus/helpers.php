<?php

/**
 * Helpers for building theme menu registry arrays.
 *
 * @param  array<int, array{0: string, 1: string}|string>  $pairs  [['Label', '/url'], ...] or 'Label'
 */
function tm_links(array $pairs, ?string $module = null): array
{
    $items = [];
    $order = 1;

    foreach ($pairs as $pair) {
        if (is_string($pair)) {
            $title = $pair;
            $url = '#';
        } else {
            [$title, $url] = $pair;
        }

        $item = [
            'title' => $title,
            'url'   => $url,
            'order' => $order++,
        ];

        if ($module !== null) {
            $item['module'] = $module;
        }

        $items[] = $item;
    }

    return $items;
}

function tm_menu(string $locationKey, string $title, array $items): array
{
    return [
        'location_key' => $locationKey,
        'title'        => $title,
        'items'        => $items,
    ];
}

function tm_footer_node_cols(string $col1, string $col2, string $col3, array $links): array
{
    return [
        tm_menu('footer_column_1', $col1, $links),
        tm_menu('footer_column_2', $col2, $links),
        tm_menu('footer_column_3', $col3, $links),
    ];
}

function tm_social_os(): array
{
    return tm_menu('social_footer', 'Social', tm_links([
        ['INSTAGRAM', '#'],
        ['LINKEDIN', '#'],
        ['X_OS', '#'],
    ]));
}

function tm_social_standard(): array
{
    return tm_menu('social_footer', 'Social', tm_links([
        ['Instagram', '#'],
        ['LinkedIn', '#'],
        ['Twitter', '#'],
    ]));
}

function tm_node_links(): array
{
    return tm_links([
        ['Registry', '#'],
        ['Verification', '#'],
        ['Support', '#'],
        ['Auth', '#'],
    ]);
}
