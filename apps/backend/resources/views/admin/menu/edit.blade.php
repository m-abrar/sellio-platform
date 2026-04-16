@extends('adminlte::page')

@section('title', 'Edit Menu: ' . $menu->title)

@section('content_header')
    <h1>Edit Menu: {{ $menu->title }} <small class="text-secondary">({{ $menu->theme_key }} - {{ $menu->location_key }})</small></h1>
@stop

@section('content')

@include('admin.alert')

{{-- 
    UTILITY FORMS: Used by JavaScript handlers
--}}
<form id="utility-delete-form" method="POST" action="" style="display: none;">
    @csrf
    @method('DELETE')
</form>

{{-- MODAL FOR EDITING SINGLE MENU ITEM --}}
<div class="modal fade" id="editItemModal" tabindex="-1" aria-labelledby="editItemModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="editItemModalLabel">Edit Menu Item</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form id="edit-item-form">
                    {{-- Hidden field to store the item ID being edited --}}
                    <input type="hidden" id="edit_item_id" name="id"> 
                    
                    <div class="form-group">
                        <label for="edit_title">Link Title</label>
                        <input type="text" id="edit_title" name="title" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_url">URL / Path</label>
                        <input type="text" id="edit_url" name="url" class="form-control" required>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="submit" form="edit-item-form" class="btn btn-primary" id="save-edit-button">Save changes</button>
            </div>
        </div>
    </div>
</div>


<div class="row">
    {{-- Card for Existing Menu Items (Structure Editor) --}}
    <div class="col-md-8">
        <div class="card card-primary card-outline">
            <div class="card-header">
                <h3 class="card-title">Menu Structure (Items and Order)</h3>
                <div class="card-tools">
                    <button type="submit" form="menu-update-form" class="btn btn-sm btn-success">
                        <i class="fas fa-save"></i> Save Menu Structure
                    </button>
                </div>
            </div>
            <div class="card-body">
                {{-- Form for bulk updates (parent_id and order) --}}
                <form id="menu-update-form" method="POST" action="{{ route('admin.menu.update_structure', $menu) }}">
                    @csrf
                    
                    {{-- Hidden input to carry the structured data (Populated by JS before submit) --}}
                    <input type="hidden" name="menu_structure" id="menu-structure-data">

                    <div class="menu-editor-container">
                        {{-- NESTABLE ROOT: Must be a div with class 'dd' --}}
                        <div id="menu-items-list" class="dd">
                            <ol class="dd-list">
                                @include('admin.menu._recursive', ['items' => $items, 'level' => 0])
                            </ol>
                        </div>
                        
                        {{-- Container for hidden inputs of newly added items --}}
                        <div id="new-items-container">
                        </div>
                    </div>
                </form>

            </div>
        </div>
    </div>
    
    {{-- Card for Adding New Menu Items --}}
    <div class="col-md-4">
        <div class="card card-secondary">
            <div class="card-header">
                <h3 class="card-title">Add New Item</h3>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label for="new_title">Link Title</label>
                    <input type="text" id="new_title" class="form-control" placeholder="e.g., Contact Us">
                </div>
                <div class="form-group">
                    <label for="new_url">URL / Path</label>
                    <input type="text" id="new_url" class="form-control" placeholder="e.g., /contact or https://external.com">
                </div>
                <button type="button" id="add-new-item" class="btn btn-primary btn-block">
                    <i class="fas fa-plus"></i> Add to List
                </button>
            </div>
        </div>
    </div>
</div>
@endsection

@section('css')
    {{-- Nestable CSS from JSDelivr (More reliable link) --}}
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/nestable2@1.6.0/jquery.nestable.min.css">
    <style>
        /* Custom Nestable Styling for AdminLTE */
        .dd-handle {
            background: #fff;
            height: 40px;
            padding: 10px 15px;
            border: 1px solid #dee2e6;
            color: #495057;
            font-weight: 600;
        }

        .dd-item > button {
            margin: 10px 5px 10px 10px;
        }

        .dd-actions {
            position: absolute;
            top: 7px;
            right: 15px;
            z-index: 10; /* Ensure buttons are clickable */
        }
        
        .dd-item {
            /* Remove default margin/padding to prevent overlap/double border with dd-handle */
            margin-bottom: 5px; 
        }

        /* Styling for new items */
        .dd-item[data-id^="new-"] .dd-handle {
            background-color: #d4edda; /* Light green for new items */
            border-color: #c3e6cb;
        }
    </style>
@endsection

@section('js')
    {{-- Nestable JS from JSDelivr (More reliable link) --}}
    <script src="https://cdn.jsdelivr.net/npm/nestable2@1.6.0/jquery.nestable.min.js"></script>
<script>
    // Utility function to show alert messages (since we can't use browser alert/confirm)
    function showAlert(message, type = 'success') {
        // Find or create the container for alerts (e.g., just below the content header)
        let alertContainer = document.querySelector('.content').querySelector('.row').parentElement;
        
        // Remove old alerts to keep the UI clean
        alertContainer.querySelectorAll('.alert').forEach(alert => alert.remove());

        const alertHtml = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        `;
        alertContainer.insertAdjacentHTML('afterbegin', alertHtml);
        // Scroll to top to ensure the user sees the message
        window.scrollTo(0, 0); 
    }

    // Wrap the entire script in a jQuery ready function for stability with plugins like Nestable
    $(function() {
        const addItemButton = document.getElementById('add-new-item');
        const newTitleInput = document.getElementById('new_title');
        const newUrlInput = document.getElementById('new_url');
        const menuItemsList = document.getElementById('menu-items-list');
        const newItemsContainer = document.getElementById('new-items-container');
        const updateForm = document.getElementById('menu-update-form');
        const utilityDeleteForm = document.getElementById('utility-delete-form');
        const editItemModal = $('#editItemModal'); // Using jQuery for Bootstrap modal functions
        const nestableRoot = $('#menu-items-list');

        let newItemIndex = 0; // Counter for unique new item names
        
        // 0. Initialize Nestable (MUST be called after the Nestable script is loaded)
        nestableRoot.nestable({
            maxDepth: 5 // Optional: Limit the nesting depth
        });


        // --- 1. Logic to add new items (Client-side) ---
        addItemButton.addEventListener('click', function() {
            const title = newTitleInput.value.trim();
            const url = newUrlInput.value.trim();

            if (title && url) {
                const tempId = `new-${newItemIndex}`;
                
                // Add to the visual list using Nestable structure
                const listItem = `
                    <li class="dd-item" 
                        data-id="${tempId}" 
                        data-title="${title}" 
                        data-url="${url}">
                        
                        <div class="dd-handle">
                            <i class="fas fa-arrows-alt mr-2 text-muted"></i>
                            <span class="item-title font-weight-bold">${title}</span> 
                            <span class="item-url ml-2 text-muted small">(${url})</span>
                            <span class="ml-3 badge badge-success">NEW</span>
                        </div>
                        
                        <div class="dd-actions">
                            <button type="button" class="btn btn-info btn-xs edit-item-btn" title="Edit Item Details">
                                <i class="fas fa-pen"></i>
                            </button>
                            <button type="button" class="btn btn-danger btn-xs" 
                                    title="Delete Item" 
                                    data-id="${tempId}" 
                                    data-action="delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </li>
                `;
                
                // Append the new item to the root list (first ol element inside the dd div)
                nestableRoot.find('.dd-list:first').append(listItem);
                
                // Add hidden fields to the form to submit for creation
                const hiddenInputs = `
                    <div id="new-input-${tempId}">
                        <input type="hidden" name="new_items[${newItemIndex}][title]" value="${title}">
                        <input type="hidden" name="new_items[${newItemIndex}][url]" value="${url}">
                    </div>
                `;
                newItemsContainer.insertAdjacentHTML('beforeend', hiddenInputs);

                // Reset fields
                newTitleInput.value = '';
                newUrlInput.value = '';
                newItemIndex++;
            } else {
                showAlert('Please enter both a Title and a URL for the new menu item.', 'warning');
            }
        });
        
        // --- 2. Logic for Delete and Edit buttons (Delegated Click Handler) ---
        // Using jQuery delegation for Nestable elements which are added dynamically
        $(menuItemsList).on('click', 'button[data-action="delete"]', function(event) {
            const deleteTarget = $(this);
            const listItem = deleteTarget.closest('.dd-item');
            const itemId = deleteTarget.data('id');
            
            // Custom confirmation dialog (replacing browser confirm)
            const isConfirmed = window.prompt(`To confirm deletion of item ID ${itemId} (and its sub-items), type DELETE below:`);
            if (isConfirmed !== 'DELETE') {
                showAlert('Deletion cancelled.', 'info');
                return;
            }

            if (String(itemId).startsWith('new-')) {
                // Handle client-side removal for newly created items
                listItem.remove();
                document.getElementById(`new-input-${itemId}`)?.remove();
                showAlert('New menu item removed from list.', 'info');
            } else {
                // Handle server-side deletion for existing items
                
                // ASSUMED ROUTE: /admin/menu/items/{item}
                const deleteUrl = `/admin/menu/items/${itemId}`; 
                
                // Update the hidden utility form's action and submit it
                utilityDeleteForm.action = deleteUrl;
                utilityDeleteForm.submit();
            }
        });
        
        $(menuItemsList).on('click', 'button.edit-item-btn', function(event) {
            const editTarget = $(this);
            const listItem = editTarget.closest('.dd-item');
            const itemId = listItem.data('id');
            
            // Get data from list item's attributes/content
            const title = listItem.data('title');
            const url = listItem.data('url');

            document.getElementById('edit_item_id').value = itemId;
            document.getElementById('edit_title').value = title;
            document.getElementById('edit_url').value = url;
            
            // Show the modal (relies on Bootstrap JS)
            editItemModal.modal('show');
        });
        
        
        // --- 3. Logic for submitting the single item Edit Form (AJAX) ---
        document.getElementById('edit-item-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const itemId = document.getElementById('edit_item_id').value;
            const title = document.getElementById('edit_title').value;
            const url = document.getElementById('edit_url').value;
            // Get CSRF token from the main form
            const token = document.querySelector('#menu-update-form input[name="_token"]').value; 
            
            // Locate the corresponding list item
            // Using jQuery selector for compatibility with data() lookup
            const listItem = $(menuItemsList).find(`li[data-id="${itemId}"]`);

            if (String(itemId).startsWith('new-')) {
                // Client-side update for NEW items
                if (listItem.length) {
                    // Update visual representation (and data attributes for future edits)
                    listItem.data('title', title).attr('data-title', title);
                    listItem.data('url', url).attr('data-url', url);
                    listItem.find('.item-title').text(title);
                    listItem.find('.item-url').text(`(${url})`);

                    // Update hidden inputs for structure submission
                    const hiddenDiv = document.getElementById(`new-input-${itemId}`);
                    if (hiddenDiv) {
                        hiddenDiv.querySelector('input[name$="[title]"]').value = title;
                        hiddenDiv.querySelector('input[name$="[url]"]').value = url;
                    }
                    
                    editItemModal.modal('hide');
                    showAlert('New item details updated locally. Click "Save Menu Structure" to finalize.', 'info');
                }
            } else {
                // Server-side update for EXISTING items (AJAX POST request with _method=PUT spoofing)
                const updateUrl = `/admin/menu/items/${itemId}`;
                
                // Use URLSearchParams to send data as application/x-www-form-urlencoded
                const formData = new URLSearchParams();
                formData.append('title', title);
                formData.append('url', url);
                formData.append('_method', 'PUT'); // Method spoofing
                formData.append('_token', token);  // CSRF token in body for form data

                fetch(updateUrl, {
                    method: 'POST', // Must be POST for spoofing
                    headers: {
                        'Accept': 'application/json',
                    },
                    body: formData // Send as form data
                })
                .then(response => {
                    // Check for general response failure
                    if (!response.ok) {
                        return response.json().then(errorData => { 
                            throw new Error(errorData.message || 'Server error or missing PUT route.'); 
                        }).catch(() => {
                            // Catch case where response is not JSON (e.g., 405 HTML page)
                            throw new Error('Server responded with an error, possibly missing PUT route or incorrect permissions.');
                        });
                    }
                    return response.json();
                })
                .then(data => {
                    // Update the list item visually (and data attributes for future edits)
                    if (listItem.length) {
                        listItem.data('title', title).attr('data-title', title);
                        listItem.data('url', url).attr('data-url', url);
                        listItem.find('.item-title').text(title);
                        listItem.find('.item-url').text(`(${url})`);
                    }
                    editItemModal.modal('hide');
                    showAlert('Menu item updated successfully!', 'success');
                })
                .catch(error => {
                    console.error('Error updating item:', error);
                    editItemModal.modal('hide');
                    showAlert('Update failed: ' + error.message, 'danger');
                });
            }
        });
        
        // --- 4. Logic for submitting nested structure (Nestable Implementation) ---
        updateForm.addEventListener('submit', function(e) {
            
            // Serialize the nested list structure using Nestable's method
            const structure = nestableRoot.nestable('serialize');
            
            // Set the value for the controller to process
            document.getElementById('menu-structure-data').value = JSON.stringify(structure);
            
            // The form will now submit with the full, correctly serialized structure.
        });
    });
</script>
@endsection
