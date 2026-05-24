{{--
    Administrative Navigation Module: Hierarchical Structure Architect
    
    This view provides a high-fidelity visual editor for the platform's 
    navigation systems. It facilitates the creation of link components, 
    real-time drag-and-drop hierarchical orchestration (via Nestable2), 
    and atomic state synchronization for multi-level menu trees.
    
    @extends adminlte::page
    @context Navigation Management
    @variables Menu $menu The menu location model instance.
    @variables Collection $items Collection of hierarchical MenuItem instances.
--}}
@extends('adminlte::page')

@section('title', 'Architecture: ' . $menu->title)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-end">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-sitemap mr-2 text-primary"></i> 
                    Navigation Architect
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Structural editor for <span class="text-primary font-weight-bold">{{ $menu->title }}</span> ({{ $menu->theme_key }} &middot; {{ $menu->location_key }})</p>
            </div>
            <div class="col-sm-6 d-flex align-items-center justify-content-end">
                @include('admin._partials._back-button', [
                    'route' => 'admin.menu.index',
                    'params' => ['theme' => $menu->theme_key],
                    'label' => 'MENU EXPLORER',
                ])
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert')

    {{-- Utility Forms --}}
    <form id="utility-delete-form" method="POST" action="" style="display: none;">
        @csrf
        @method('DELETE')
    </form>
    <div class="row">
        <div class="col-md-8">
            <div class="card card-premium shadow-premium mb-4 overflow-hidden">
                <div class="card-header bg-white border-0 py-3 px-4">
                    <h3 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1">Add Link Component</h3>
                </div>
                <div class="card-body p-4">
                    <div class="row">
                        <div class="col-md-5">
                            <div class="form-group mb-0">
                                <label class="smallest font-weight-bold text-secondary text-uppercase mb-2">Display Label</label>
                                <input type="text" id="new_title" class="form-control" placeholder="e.g. Contact Support" style="border-radius: 12px; height: 45px;">
                            </div>
                        </div>
                        <div class="col-md-5">
                            <div class="form-group mb-0">
                                <label class="smallest font-weight-bold text-secondary text-uppercase mb-2">Target URL / Route</label>
                                <input type="text" id="new_url" class="form-control" placeholder="e.g. /support or https://..." style="border-radius: 12px; height: 45px;">
                            </div>
                        </div>
                        <div class="col-md-2 d-flex align-items-end">
                            <button type="button" id="add-new-item" class="btn btn-primary btn-block rounded-pill h-45 font-weight-bold shadow-sm" style="height: 45px;">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card border-0 shadow-premium overflow-hidden" style="border-radius: 24px;">
                <div class="card-header bg-white py-4 px-4 border-0">
                    <h3 class="card-title font-weight-bold text-dark mb-0">
                        <i class="fas fa-stream mr-2 text-primary opacity-50"></i> Hierarchy Canvas
                    </h3>
                </div>
                <div class="card-body p-4">
                    {{-- Form for bulk updates (parent_id and order) --}}
                    <form id="menu-update-form" method="POST" action="{{ route('admin.menu.update_structure', $menu) }}">
                        @csrf
                        <input type="hidden" name="menu_structure" id="menu-structure-data">

                        <div class="menu-editor-container">
                            <div id="menu-items-list" class="dd">
                                <ol class="dd-list">
                                    @include('admin.menu._recursive', ['items' => $items, 'level' => 0])
                                </ol>
                            </div>
                            <div id="new-items-container"></div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        
        {{-- Right Sidebar Actions --}}
        <div class="col-md-4">
            <div class="sticky-top" style="top: 20px;">
                {{-- Deployment Intelligence Card --}}
                <div class="card card-premium overflow-hidden shadow-premium mb-4">
                <div class="card-header bg-dark d-flex align-items-center py-3 px-4 border-0" style="background: #0f172a !important; border-bottom: 3px solid var(--primary) !important;">
                    <h3 class="card-title text-white mb-0 font-weight-bold smallest text-uppercase letter-spacing-1">
                        <i class="fas fa-rocket mr-2 text-primary"></i> Protocol & Actions
                    </h3>
                </div>
                
                <div class="card-body bg-white py-4 px-4">
                    <div class="action-buttons-group">
                        <button type="submit" form="menu-update-form" class="btn btn-primary btn-block rounded-pill font-weight-bold py-3 smallest mb-3 uppercase letter-spacing-1 shadow-premium-lg">
                            <i class="fas fa-save mr-2"></i> SYNCHRONIZE STRUCTURE
                        </button>
                    </div>
                    <p class="text-muted smallest mt-2 mb-0 text-center">
                        <i class="fas fa-info-circle mr-1"></i> Finalize all hierarchical changes before deployment.
                    </p>
                </div>

                @if(isset($menu->updated_at))
                    <div class="card-footer bg-light border-top-0 text-center py-2">
                        <small class="text-muted smallest text-uppercase letter-spacing-1">
                            <i class="far fa-clock mr-1"></i> 
                            Last Sync: {{ $menu->updated_at->format('M d, H:i') }}
                        </small>
                    </div>
                @endif
            </div>


            <div class="bg-primary-soft p-4 rounded-xl border border-primary-soft shadow-xs">
                <h6 class="font-weight-bold text-primary mb-2 text-uppercase smallest letter-spacing-1">Editor Intelligence</h6>
                <p class="text-muted small mb-0">
                    Drag and drop items to establish parent-child relationships. Hierarchical changes only take effect once you click <strong>Deploy Structure</strong>.
                </p>
            </div>
        </div>
    </div>
    </div>
</div>

{{-- MODAL FOR EDITING SINGLE MENU ITEM --}}
<div class="modal fade" id="editItemModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-premium" style="border-radius: 24px;">
            <div class="modal-header border-0 pt-4 px-4">
                <h5 class="modal-title">Edit Component Details</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body p-4">
                <form id="edit-item-form">
                    <input type="hidden" id="edit_item_id" name="id"> 
                    <div class="form-group mb-3">
                        <label class="small font-weight-bold text-secondary text-uppercase mb-2">Link Label</label>
                        <input type="text" id="edit_title" name="title" class="form-control" required style="border-radius: 12px;">
                    </div>
                    <div class="form-group mb-0">
                        <label class="small font-weight-bold text-secondary text-uppercase mb-2">Destination URL</label>
                        <input type="text" id="edit_url" name="url" class="form-control" required style="border-radius: 12px;">
                    </div>
                </form>
            </div>
            <div class="modal-footer border-0">
                <button type="button" class="btn btn-light rounded-pill px-4 font-weight-bold" data-dismiss="modal">CANCEL</button>
                <button type="submit" form="edit-item-form" class="btn btn-primary rounded-pill px-4 font-weight-bold">UPDATE COMPONENT</button>
            </div>
        </div>
    </div>
</div>
@endsection

@section('css')
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/nestable2@1.6.0/jquery.nestable.min.css">
    <style>
        .dd-handle {
            background: #fff;
            height: 52px;
            padding: 14px 20px;
            border: 1px solid #f1f5f9;
            color: var(--dark);
            font-weight: 600;
            border-radius: 16px !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.02);
            transition: all 0.3s ease;
        }
        .dd-handle:hover { border-color: var(--primary-soft); background: #fcfdfe; }
        .dd-item > button { margin: 16px 5px 10px 15px; color: var(--primary); font-weight: bold; }
        .dd-actions { position: absolute; top: 10px; right: 20px; z-index: 10; }
        .dd-item { margin-bottom: 12px; }
        .dd-item[data-id^="new-"] .dd-handle { background-color: var(--success-soft); border-color: rgba(40,167,69,0.2); }
        .rounded-xl { border-radius: 20px !important; }
        .btn-xs { padding: 4px 8px; font-size: 0.75rem; border-radius: 8px; }
        .shadow-xs { box-shadow: 0 2px 4px rgba(0,0,0,0.05) !important; }
        .smallest { font-size: 0.65rem; }
    </style>
@stop

@section('js')
    <script src="https://cdn.jsdelivr.net/npm/nestable2@1.6.0/jquery.nestable.min.js"></script>
    <script>
        function showAlert(message, type = 'success') {
            let alertContainer = document.querySelector('.content').querySelector('.container-fluid');
            const alertHtml = `
                <div class="alert alert-${type} alert-dismissible fade show rounded-xl shadow-sm border-0 mb-4" role="alert">
                    <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} mr-2"></i> ${message}
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            `;
            alertContainer.insertAdjacentHTML('afterbegin', alertHtml);
            window.scrollTo(0, 0); 
        }

        $(function() {
            const addItemButton = document.getElementById('add-new-item');
            const newTitleInput = document.getElementById('new_title');
            const newUrlInput = document.getElementById('new_url');
            const menuItemsList = document.getElementById('menu-items-list');
            const newItemsContainer = document.getElementById('new-items-container');
            const updateForm = document.getElementById('menu-update-form');
            const utilityDeleteForm = document.getElementById('utility-delete-form');
            const editItemModal = $('#editItemModal');
            const nestableRoot = $('#menu-items-list');

            let newItemIndex = 0;
            nestableRoot.nestable({ maxDepth: 5 });

            addItemButton.addEventListener('click', function() {
                const title = newTitleInput.value.trim();
                const url = newUrlInput.value.trim();
                if (title && url) {
                    const tempId = `new-${newItemIndex}`;
                    const listItem = `
                        <li class="dd-item" data-id="${tempId}" data-title="${title}" data-url="${url}">
                            <div class="dd-handle">
                                <i class="fas fa-grip-lines mr-3 text-muted opacity-50"></i>
                                <span class="item-title font-weight-bold">${title}</span> 
                                <span class="item-url ml-2 text-muted small opacity-50">(${url})</span>
                                <span class="ml-3 badge badge-success-light text-success smallest">NEW</span>
                            </div>
                            <div class="dd-actions">
                                <button type="button" class="btn btn-primary-soft btn-xs edit-item-btn mr-1" title="Edit Component">
                                    <i class="fas fa-pen"></i>
                                </button>
                                <button type="button" class="btn btn-danger-light btn-xs" title="Remove" data-id="${tempId}" data-action="delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </li>
                    `;
                    nestableRoot.find('.dd-list:first').append(listItem);
                    const hiddenInputs = `<div id="new-input-${tempId}"><input type="hidden" name="new_items[${newItemIndex}][title]" value="${title}"><input type="hidden" name="new_items[${newItemIndex}][url]" value="${url}"></div>`;
                    newItemsContainer.insertAdjacentHTML('beforeend', hiddenInputs);
                    newTitleInput.value = ''; newUrlInput.value = ''; newItemIndex++;
                } else {
                    showAlert('Please define both label and URL for the component.', 'warning');
                }
            });
            
            $(menuItemsList).on('click', 'button[data-action="delete"]', function(event) {
                const deleteTarget = $(this);
                const listItem = deleteTarget.closest('.dd-item');
                const itemId = deleteTarget.data('id');
                if (confirm('Permanently remove this navigation component and all its children?')) {
                    if (String(itemId).startsWith('new-')) {
                        listItem.remove();
                        document.getElementById(`new-input-${itemId}`)?.remove();
                    } else {
                        utilityDeleteForm.action = `/admin/menu/items/${itemId}`;
                        utilityDeleteForm.submit();
                    }
                }
            });
            
            $(menuItemsList).on('click', 'button.edit-item-btn', function(event) {
                const editTarget = $(this);
                const listItem = editTarget.closest('.dd-item');
                document.getElementById('edit_item_id').value = listItem.data('id');
                document.getElementById('edit_title').value = listItem.data('title');
                document.getElementById('edit_url').value = listItem.data('url');
                editItemModal.modal('show');
            });
            
            document.getElementById('edit-item-form').addEventListener('submit', function(e) {
                e.preventDefault();
                const itemId = document.getElementById('edit_item_id').value;
                const title = document.getElementById('edit_title').value;
                const url = document.getElementById('edit_url').value;
                const token = document.querySelector('#menu-update-form input[name="_token"]').value; 
                const listItem = $(menuItemsList).find(`li[data-id="${itemId}"]`);

                if (String(itemId).startsWith('new-')) {
                    if (listItem.length) {
                        listItem.data('title', title).attr('data-title', title);
                        listItem.data('url', url).attr('data-url', url);
                        listItem.find('.item-title').text(title);
                        listItem.find('.item-url').text(`(${url})`);
                        const hiddenDiv = document.getElementById(`new-input-${itemId}`);
                        if (hiddenDiv) {
                            hiddenDiv.querySelector('input[name$="[title]"]').value = title;
                            hiddenDiv.querySelector('input[name$="[url]"]').value = url;
                        }
                        editItemModal.modal('hide');
                        showAlert('Component updated locally.', 'info');
                    }
                } else {
                    const formData = new URLSearchParams();
                    formData.append('title', title); formData.append('url', url); formData.append('_method', 'PUT'); formData.append('_token', token);
                    fetch(`/admin/menu/items/${itemId}`, { method: 'POST', headers: { 'Accept': 'application/json' }, body: formData })
                    .then(response => response.json())
                    .then(data => {
                        if (listItem.length) {
                            listItem.data('title', title).attr('data-title', title);
                            listItem.data('url', url).attr('data-url', url);
                            listItem.find('.item-title').text(title);
                            listItem.find('.item-url').text(`(${url})`);
                        }
                        editItemModal.modal('hide');
                        showAlert('Menu item updated successfully!', 'success');
                    })
                    .catch(error => showAlert('Update failed: ' + error.message, 'danger'));
                }
            });
            
            updateForm.addEventListener('submit', function(e) {
                document.getElementById('menu-structure-data').value = JSON.stringify(nestableRoot.nestable('serialize'));
            });
        });
    </script>
@endsection
