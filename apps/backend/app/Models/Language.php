<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Language extends Model
{
    protected $fillable = [
        'name',
        'code',
        'is_default',
        'is_active',
        'flag_icon',
    ];

    /**
     * Get the translation file path for this language.
     */
    public function getTranslationFilePath()
    {
        return base_path('lang/' . $this->code . '.json');
    }

    /**
     * Get translations as an array.
     */
    public function getTranslations()
    {
        $path = $this->getTranslationFilePath();
        if (!file_exists($path)) {
            return [];
        }
        return json_decode(file_get_contents($path), true) ?: [];
    }
}
