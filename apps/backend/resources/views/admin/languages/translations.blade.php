{{--
    Administrative Localization Module: Translation Orchestration
    
    This view provides a high-fidelity interface for managing JSON-based 
    translation keys. It facilitates real-time editing and synchronization 
    of marketplace-wide strings.
--}}
@extends('adminlte::page')

@section('title', __('Translations: :name', ['name' => $language->name]))

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-edit mr-2 text-primary opacity-50"></i> {{ __('Edit Translations') }}: <span class="text-primary">{{ $language->name }}</span>
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                    {{ __('Synchronize marketplace strings with regional dialects and terminology.') }}
                </p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.languages.index') }}" class="btn-back shadow-sm">
                    <i class="fas fa-arrow-left mr-2"></i> {{ __('Back to List') }}
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert')

    <div class="card card-premium shadow-premium border-0 overflow-hidden rounded-24">
        <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center justify-content-between">
            <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">
                <i class="fas fa-search mr-2 text-primary opacity-50"></i> {{ __('All Strings') }}
            </h3>
            <div class="card-tools ml-auto">
                <div class="input-group input-group-premium" style="width: 300px;">
                    <div class="input-group-prepend">
                        <span class="input-group-text"><i class="fas fa-filter"></i></span>
                    </div>
                    <input type="text" id="translationSearch" class="form-control" placeholder="{{ __('Search keys or values...') }}">
                </div>
            </div>
        </div>

        <form action="{{ route('admin.languages.translations.update', $language) }}" method="POST">
            @csrf
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table id="translationsTable" class="table table-hover table-premium mb-0">
                        <thead class="thead-light">
                            <tr>
                                <th class="px-4 w-40-p">{{ __('Key / Identity') }}</th>
                                <th class="w-60-p">{{ __('Regional Translation') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse ($translations as $key => $value)
                                <tr class="translation-row">
                                    <td class="align-middle px-4">
                                        <span class="d-block font-weight-bold text-dark mb-0 translation-key">{{ $key }}</span>
                                        <small class="text-muted smallest text-monospace opacity-70">JSON KEY</small>
                                    </td>
                                    <td class="align-middle py-3">
                                        <div class="form-group mb-0">
                                            <input type="text" name="translations[{{ $key }}]" class="form-control form-control-premium translation-value" 
                                                   value="{{ $value }}" placeholder="{{ __('Add translation...') }}">
                                        </div>
                                    </td>
                                </tr>
                            @empty
                                @include('admin._partials._empty-state', [
                                    'colspan' => 2,
                                    'icon' => 'fas fa-ghost',
                                    'title' => __('No Keys Detected'),
                                    'description' => __('The JSON dictionary for this language is currently empty. Sync keys from the master template to begin.')
                                ])
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="card-footer border-0 bg-white p-4 d-flex justify-content-between align-items-center">
                <p class="text-muted smallest mb-0 font-weight-bold uppercase letter-spacing-1">
                    <i class="fas fa-info-circle mr-1"></i> {{ __('Total Keys') }}: {{ count($translations) }}
                </p>
                <button type="submit" class="btn btn-primary rounded-pill px-5 py-2 font-weight-bold shadow-premium uppercase letter-spacing-1">
                    <i class="fas fa-sync-alt mr-2"></i> {{ __('SYNCHRONIZE DICTIONARY') }}
                </button>
            </div>
        </form>
    </div>
</div>
@endsection

@section('js')
    <script>
        $(function () {
            // High-fidelity real-time filtering
            $('#translationSearch').on('keyup', function() {
                var value = $(this).val().toLowerCase();
                $(".translation-row").filter(function() {
                    $(this).toggle(
                        $(this).find('.translation-key').text().toLowerCase().indexOf(value) > -1 || 
                        $(this).find('.translation-value').val().toLowerCase().indexOf(value) > -1
                    );
                });
            });
        });
    </script>
@stop
