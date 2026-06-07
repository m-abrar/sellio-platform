Scan all Laravel project files, especially Models, Controllers, Services, Jobs, Middleware, Requests, Resources, Policies, Observers, Listeners, Console Commands, Traits, and Helpers.

Find any fully-qualified class references written directly inside the code, for example:

`\App\Models\User`
`\App\Services\PaymentService`
`\Spatie\MediaLibrary\HasMedia`
`\Illuminate\Support\Facades\DB`

These should not be repeatedly called inline inside methods or class bodies.

Move them to the top of the file as proper `use` statements, then update the code to use the short class name.

Example:

Before:
`$user = \App\Models\User::find($id);`

After:
`use App\Models\User;`

`$user = User::find($id);`

Please audit each file carefully and fix only valid PHP class references. Do not change string values, config keys, route names, view paths, database table names, comments, or documentation examples unless they are actual PHP class references.

Also check for duplicate imports, unused imports, conflicting class names, and inconsistent namespace usage. After fixing, provide a clear report listing:

1. Files scanned
2. Files changed
3. Fully-qualified class names replaced
4. Any skipped items with reason
5. Any possible namespace conflicts that need manual review

Goal: Improve Laravel code quality, readability, maintainability, and PSR-12 compliance without changing application behavior.
