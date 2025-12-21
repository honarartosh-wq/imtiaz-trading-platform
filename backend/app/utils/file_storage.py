"""
Secure file storage utilities for KYC documents.
Implements secure file naming, storage, and permission management.
"""
import os
import secrets
from pathlib import Path
from datetime import datetime
from typing import Optional


# KYC document storage path - should be outside web root in production
KYC_STORAGE_PATH = Path("secure_storage/kyc_documents")
KYC_STORAGE_PATH.mkdir(parents=True, exist_ok=True)


def save_kyc_document(
    file_contents: bytes, 
    user_id: int, 
    doc_type: str, 
    extension: str
) -> str:
    """
    Save KYC document with secure random filename.
    
    Args:
        file_contents: Binary content of the file
        user_id: ID of the user uploading the document
        doc_type: Type of document (id_document, proof_of_address, etc.)
        extension: File extension (without dot)
    
    Returns:
        Secure file path relative to storage root
    
    Security measures:
    - Random filename prevents predictable paths
    - User-specific directories isolate documents
    - Restrictive permissions (0o600) prevent unauthorized access
    """
    # Generate secure random filename
    random_name = secrets.token_urlsafe(16)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    secure_filename = f"{user_id}_{doc_type}_{timestamp}_{random_name}.{extension}"
    
    # Create user directory
    user_dir = KYC_STORAGE_PATH / str(user_id)
    user_dir.mkdir(exist_ok=True)
    
    # Save file
    file_path = user_dir / secure_filename
    with open(file_path, 'wb') as f:
        f.write(file_contents)
    
    # Set restrictive permissions (owner read/write only)
    os.chmod(file_path, 0o600)
    
    return str(file_path)


def get_kyc_document_path(user_id: int, filename: str) -> Optional[Path]:
    """
    Get the full path to a KYC document if it exists.
    
    Args:
        user_id: User ID
        filename: Name of the file
    
    Returns:
        Path object if file exists, None otherwise
    """
    file_path = KYC_STORAGE_PATH / str(user_id) / filename
    if file_path.exists() and file_path.is_file():
        return file_path
    return None


def delete_kyc_document(user_id: int, filename: str) -> bool:
    """
    Delete a KYC document securely.
    
    Args:
        user_id: User ID
        filename: Name of the file to delete
    
    Returns:
        True if deleted successfully, False otherwise
    """
    file_path = get_kyc_document_path(user_id, filename)
    if file_path:
        try:
            file_path.unlink()
            return True
        except Exception:
            return False
    return False
