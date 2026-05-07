{{--
    Administrative Content: Page Composition Registry
    
    This view provides the authoritative index of composite landing 
    pages. It tracks publication status, URI slugs, and provides 
    direct access to the high-fidelity orchestration engine for 
    visual page design.
    
    @extends adminlte::page
    @context Page Builder Module
    @variables Collection $pages Collection of PageBuilder model instances.
--}}
@extends('adminlte::page')

@section('plugins.Datatables', true)

@section('title', 'Pages')

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                     Pages
                </h1>
            </div>
        </div>
    </div>
@stop

@section('content')

@include('admin.alert')

<div class="card card-primary card-outline shadow-sm border-0">
    <div class="card-header border-0 bg-white py-3">
        <h3 class="card-title">Available Pages List</h3>
        <a href="{{ route('admin.pages.create') }}" class="btn btn-primary float-right">
            <i class="fas fa-plus"></i> Add Page
        </a>
    </div>
    <div class="card-body">
        <table class="table table-hover table-premium mb-0">
            <thead class="thead-light">
                <tr>
                    <th>Title</th>
                    <th>Slug</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($pages as $page)
                    <tr>
                        <td>{{ $page->title }}</td>
                        <td>{{ $page->slug }}</td>
                        <td>
                            @if($page->status == 'active')
                                <span class="badge badge-success">Active</span>
                            @else
                                <span class="badge badge-danger">Inactive</span>
                            @endif
                        </td>
                        <td class="table-column-actions">
                            <a href="{{ route('admin.pages.edit', $page->id) }}" class="btn btn-primary btn-sm">
                                <i class="fas fa-edit"></i>
                            </a>
                            <form action="{{ route('admin.pages.destroy', $page->id) }}" method="POST" style="display:inline;">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="btn btn-danger btn-sm" onclick="return confirm('Are you sure?')">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </form>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</div>

@endsection


