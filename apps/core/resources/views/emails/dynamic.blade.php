{{-- resources/views/emails/dynamic.blade.php --}}
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    {{-- This variable contains the HTML body from the database template --}}
    {!! $bodyContent !!}
</body>
</html>
