import os
import re

base_path = r"d:\Sellio\apps\backend"
audit_file = os.path.join(base_path, ".audit", "04_views_admin.md")

# Extract file paths from the audit markdown
with open(audit_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern to find file paths like resources\views\admin\...
target_files = re.findall(r'`(resources\\views\\admin\\[^`]+)`', content)
target_files = [os.path.join(base_path, f) for f in target_files]

error_files = []

for filepath in target_files:
    if not os.path.exists(filepath):
        continue
        
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            file_content = f.read()
            
        has_error = False
        # Inline <style>
        if '<style' in file_content:
            has_error = True
        # Inline <script> (simple check: contains <script but not <script src=)
        elif re.search(r'<script(?![^>]*src=)', file_content, re.IGNORECASE):
            has_error = True
        # Style attributes
        elif 'style="' in file_content or "style='" in file_content:
            has_error = True
        # Inline event handlers
        elif re.search(r'\s+on\w+=', file_content, re.IGNORECASE):
            has_error = True
            
        if has_error:
            error_files.append(filepath)
    except Exception:
        pass

print(f"TOTAL_TARGET_FILES: {len(target_files)}")
print(f"TOTAL_ERROR_FILES: {len(error_files)}")
